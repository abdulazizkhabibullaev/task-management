import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserError } from 'src/common/db/models/user/user.error';
import { ProjectService } from 'src/common/service/project/project.service';
import { TaskService } from 'src/common/service/task/task.service';
import { CustomRequest } from 'src/common/types/common.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { AuthGuard } from 'src/modules/common/guard/auth.guard';
import { ProjectDto, ProjectGetDto, ProjectUpdateDto } from './project.dto';

@ApiTags('Project')
@Controller('project')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ProjectController {
    constructor(
        private projectService: ProjectService,
        private taskService: TaskService,
    ) {}

    @Post('create')
    async create(@Body() dto: ProjectDto, @Req() req: CustomRequest) {
        dto.user_id = req.user._id;
        return await this.projectService.create(dto);
    }

    @Post('paging')
    async paging(@Body() dto: ProjectGetDto, @Req() req: CustomRequest) {
        return await this.projectService.getByPaging(dto, req.user._id);
    }

    @Get('get-by-id/:_id')
    async getById(@Param() dto: BaseIdDto, @Req() req: CustomRequest) {
        const result = await this.projectService.getById(dto._id);
        if (result.user_id.toString() !== req.user._id.toString()) throw UserError.NoPermission();
        return result;
    }

    @Put('update')
    async update(@Body() dto: ProjectUpdateDto, @Req() req: CustomRequest) {
        const project = await this.projectService.getById(dto._id);
        if (!project.user_id.equals(req.user._id)) throw UserError.NoPermission();

        return await this.projectService.updateOne(dto._id, dto);
    }

    @Delete('delete/:_id')
    async delete(@Param() dto: BaseIdDto, @Req() req: CustomRequest) {
        const project = await this.projectService.getById(dto._id);
        if (!project.user_id.equals(req.user._id)) throw UserError.NoPermission();

        return await this.projectService.withTransaction(async (session) => {
            const deleted = await this.projectService.deleteOne(dto._id, req.user._id, { session });
            await this.taskService.deleteByProjectId(dto._id, req.user._id, { session });
            return deleted;
        });
    }
}
