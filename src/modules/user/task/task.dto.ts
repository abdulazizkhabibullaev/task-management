import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID } from 'src/common/constant/doc.constants';
import { TaskPriority, TaskStatus } from 'src/common/db/models/task/task.model';
import { BaseDto, BaseIdDto, PagingDto } from 'src/common/validation/common.dto';
import { IsDateCustom } from 'src/common/validation/custom/IsDate';
import { IsMongoIdCustom } from 'src/common/validation/custom/IsMongoId';

export class TaskDto extends BaseDto {
    @ApiProperty({ example: DOC_ID, type: String })
    @IsMongoIdCustom()
    project_id: Types.ObjectId;

    @ApiProperty({ example: 'Task 001', type: String })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Example task description', type: String, required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: TaskPriority, type: String, required: false })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @ApiProperty({ example: new Date(), type: String, required: false })
    @IsDateCustom()
    @IsOptional()
    due_date?: Date;

    user_id: Types.ObjectId;
}

export class TaskGetDto extends PagingDto {
    @ApiProperty({ example: DOC_ID, type: String, required: false })
    @IsMongoIdCustom()
    @IsOptional()
    project_id?: Types.ObjectId;

    @ApiProperty({ enum: TaskPriority, type: String, required: false })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;
}

export class TaskUpdateDto extends IntersectionType(BaseIdDto, TaskDto) {}

export class TaskUpdateStatusDto extends BaseIdDto {
    @ApiProperty({ enum: TaskStatus, type: String })
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus;
}
