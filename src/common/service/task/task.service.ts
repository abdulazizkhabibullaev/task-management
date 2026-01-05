import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { TaskError } from 'src/common/db/models/task/task.error';
import { Task, TaskModel, TaskStatus } from 'src/common/db/models/task/task.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { TaskGetDto } from 'src/modules/user/task/task.dto';
import { CommonService } from '../common.service';

@Injectable({})
export class TaskService extends CommonService<Task> {
    constructor() {
        super(TaskModel, ErrorCodes.TASK, ErrorCodes.TASK + 1);
    }

    async getByPaging(dto: TaskGetDto, user_id: Types.ObjectId) {
        const { search, project_id, priority, date_from, date_to } = dto;
        const query: typeof this.Filter = {
            user_id,
        };

        if (project_id) query.project_id = project_id;
        if (priority) query.priority = priority;
        if (date_from) {
            if (date_to) query.due_date = { $gte: date_from, $lte: date_to };
            else query.due_date = { $gte: date_from };
        } else if (date_to) query.due_date = { $lte: date_to };

        if (search) query.$or = [{ title: search }, { description: search }];

        const $project: PipelineStage.Project = {
            $project: {
                title: 1,
                description: 1,
                status: 1,
                priority: 1,
                due_date: 1,
                created_at: 1,
                updated_at: 1,
            },
        };

        const pipeline: PipelineStage[] = [$project];

        return await this.findPaging(query, dto, pipeline);
    }

    async getById(id: Types.ObjectId) {
        const $match: PipelineStage.Match = {
            $match: {
                _id: id,
            },
        };

        const $project: PipelineStage.Project = {
            $project: {
                title: 1,
                description: 1,
                status: 1,
                priority: 1,
                due_date: 1,
                created_at: 1,
                updated_at: 1,
            },
        };

        const pipeline: PipelineStage[] = [$match, $project];

        const item = (await this.aggregate(pipeline)).shift();

        if (!item) throw TaskError.NotFound({ _id: id });

        return item;
    }

    async setStatus(id: Types.ObjectId, status: TaskStatus) {
        return await this.updateOne(id, { status });
    }

    async deleteByProjectId(project_id: Types.ObjectId, user_id: Types.ObjectId, options) {
        return await this.deleteMany({ project_id }, user_id, options);
    }

    async getCountByStatus(user_id: Types.ObjectId) {
        const query: typeof this.Filter = {
            user_id,
        };

        const $match: PipelineStage.Match = {
            $match: query,
        };

        const $group: PipelineStage.Group = {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        };

        const $groupTotal: PipelineStage.Group = {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                statuses: {
                    $push: {
                        status: '$_id',
                        count: '$count',
                    },
                },
            },
        };

        const pipeline: PipelineStage[] = [$match, $group, $groupTotal];

        return (await this.aggregate(pipeline)).shift() || { total: 0, statuses: [] };
    }
}
