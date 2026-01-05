import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import { CollectionNames } from 'src/common/constant/collections';
import { AcceptLanguages } from 'src/common/constant/languages';
import { BaseModel } from '../base.model';

@modelOptions({
    schemaOptions: {
        collection: CollectionNames.USER,
    },
})
@index(
    { phone_number: 1 },
    {
        unique: true,
        background: true,
        name: 'phone_number',
        partialFilterExpression: { is_deleted: { $eq: false } },
    },
)
export class User extends BaseModel {
    @prop({ default: '', trim: true })
    full_name: string;

    @prop({ required: true, trim: true })
    phone_number: string;

    @prop({ trim: true })
    password?: string;

    @prop({ default: AcceptLanguages.UZ })
    locale?: AcceptLanguages;
}

export const UserModel = getModelForClass(User);
