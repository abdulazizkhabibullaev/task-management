import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../base.model';

export enum TaskStatus {
    TO_DO = 'to_do',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.TASK,
    },
})
@index(
    { user_id: 1, project_id: 1, status: 1, priority: 1 },
    {
        name: 'compound',
        background: true,
    },
)
export class Task extends BaseModel {
    @prop({ required: true, type: Types.ObjectId, ref: CollectionNames.USER, immutable: true })
    user_id: Types.ObjectId;

    @prop({ required: true, type: Types.ObjectId, ref: CollectionNames.PROJECT })
    project_id: Types.ObjectId;

    @prop({ required: true, trim: true })
    title: string;

    @prop({ trim: true })
    description?: string;

    @prop({ enum: TaskStatus, default: TaskStatus.TO_DO })
    status?: TaskStatus;

    @prop({ enum: TaskPriority, default: TaskPriority.LOW })
    priority?: TaskPriority;

    @prop({})
    due_date?: Date;
}

export const TaskModel = getModelForClass(Task);
