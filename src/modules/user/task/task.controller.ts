import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserError } from 'src/common/db/models/user/user.error';
import { TaskService } from 'src/common/service/task/task.service';
import { CustomRequest } from 'src/common/types/common.types';
import { BaseIdDto } from 'src/common/validation/common.dto';
import { AuthGuard } from 'src/modules/common/guard/auth.guard';
import { TaskDto, TaskGetDto, TaskUpdateDto, TaskUpdateStatusDto } from './task.dto';

@ApiTags('Task')
@Controller('task')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Post('create')
    async create(@Body() dto: TaskDto, @Req() req: CustomRequest) {
        dto.user_id = req.user._id;
        return await this.taskService.create(dto);
    }

    @Post('paging')
    async paging(@Body() dto: TaskGetDto, @Req() req: CustomRequest) {
        return await this.taskService.getByPaging(dto, req.user._id);
    }

    @Get('get-by-id/:_id')
    async getById(@Param() dto: BaseIdDto, @Req() req: CustomRequest) {
        const result = await this.taskService.getById(dto._id);
        if (result.user_id.toString() !== req.user._id.toString()) throw UserError.NoPermission();
        return result;
    }

    @Put('update')
    async update(@Body() dto: TaskUpdateDto, @Req() req: CustomRequest) {
        const task = await this.taskService.getById(dto._id);
        if (!task.user_id.equals(req.user._id)) throw UserError.NoPermission();

        return await this.taskService.updateOne(dto._id, dto);
    }

    @Put('set-status')
    async setStatus(@Body() dto: TaskUpdateStatusDto, @Req() req: CustomRequest) {
        const task = await this.taskService.getById(dto._id);
        if (!task.user_id.equals(req.user._id)) throw UserError.NoPermission();

        return await this.taskService.setStatus(dto._id, dto.status);
    }

    @Delete('delete/:_id')
    async delete(@Param() dto: BaseIdDto, @Req() req: CustomRequest) {
        const task = await this.taskService.getById(dto._id);
        if (!task.user_id.equals(req.user._id)) throw UserError.NoPermission();

        return await this.taskService.deleteOne(dto._id, req.user._id);
    }

    @Get('statistics')
    async getStatistics(@Req() req: CustomRequest) {
        return await this.taskService.getCountByStatus(req.user._id);
    }
}
