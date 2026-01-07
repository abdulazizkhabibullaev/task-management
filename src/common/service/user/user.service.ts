import { Injectable } from '@nestjs/common';
import md5 from 'md5';
import { PipelineStage } from 'mongoose';
import { UserError } from 'src/common/db/models/user/user.error';
import { User, UserModel } from 'src/common/db/models/user/user.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../common.service';

@Injectable({})
export class UserService extends CommonService<User> {
    constructor() {
        super(UserModel, ErrorCodes.USER, ErrorCodes.USER + 1);
    }

    async save(dto: User) {
        dto.password = md5(dto.password);
        return await super.create(dto);
    }

    async getByPhoneNumber(phone_number: string) {
        const query: typeof this.Filter = {
            phone_number,
        };

        const $match: PipelineStage.Match = {
            $match: query,
        };

        const pipeline: PipelineStage[] = [$match];

        const item = (await this.aggregate(pipeline)).shift();
        if (!item) throw UserError.NotFound({ phone_number });

        return item;
    }
}
