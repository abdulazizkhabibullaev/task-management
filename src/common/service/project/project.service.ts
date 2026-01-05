import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
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

        const $project: PipelineStage.Project = {
            $project: {
                name: 1,
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
                name: 1,
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
