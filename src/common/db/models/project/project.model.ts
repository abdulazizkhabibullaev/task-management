import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CollectionNames } from 'src/common/constant/collections';
import { BaseModel } from '../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.PROJECT,
    },
})
@index(
    { user_id: 1, name: 1 },
    {
        unique: true,
        background: true,
        name: 'name',
        partialFilterExpression: { is_deleted: { $eq: false } },
    },
)
export class Project extends BaseModel {
    @prop({ required: true, type: Types.ObjectId, ref: CollectionNames.USER })
    user_id: Types.ObjectId;

    @prop({ required: true, trim: true })
    name: string;
}

export const ProjectModel = getModelForClass(Project);
