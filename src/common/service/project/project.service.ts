import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { ProjectError } from 'src/common/db/models/project/project.error';
import { Project, ProjectModel } from 'src/common/db/models/project/project.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { ProjectGetDto } from 'src/modules/user/project/project.dto';
import { CommonService } from '../common.service';

@Injectable({})
export class ProjectService extends CommonService<Project> {
    constructor() {
        super(ProjectModel, ErrorCodes.PROJECT, ErrorCodes.PROJECT + 1);
    }

    async getByPaging(dto: ProjectGetDto, user_id: Types.ObjectId) {
        const { search } = dto;
        const query: typeof this.Filter = {
            user_id,
        };

        if (search) query.name = search;

        const $lookupTasks: PipelineStage.Lookup = {
            $lookup: {
                from: CollectionNames.TASK,
                localField: '_id',
                foreignField: 'project_id',
                pipeline: [
                    {
                        $match: {
                            is_deleted: false,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                ],
                as: 'tasks',
            },
        };

        const $unwindTasks: PipelineStage.Unwind = {
            $unwind: {
                path: '$tasks',
                preserveNullAndEmptyArrays: true,
            },
        };

        const $project: PipelineStage.Project = {
            $project: {
                name: 1,
                user_id: 1,
                created_at: 1,
                updated_at: 1,
                task_count: { $ifNull: ['$tasks.count', 0] },
            },
        };

        const pipeline: PipelineStage[] = [$lookupTasks, $unwindTasks, $project];
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
                name: 1,
                user_id: 1,
                created_at: 1,
                updated_at: 1,
            },
        };

        const pipeline: PipelineStage[] = [$match, $project];

        const item = (await this.aggregate(pipeline)).shift();

        if (!item) throw ProjectError.NotFound({ _id: id });

        return item;
    }
}
