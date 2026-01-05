import mongoose from 'mongoose';
import { IConfigService } from '../config/config.interface';
import { Logger } from '@nestjs/common';
import * as util from 'node:util';

export async function connectToDB(config: IConfigService): Promise<void> {
    try {
        await mongoose.connect(config.get('DB_URL'));
        mongoose.set('debug', function (collectionName, methodName, ...methodArgs) {
            const msgMapper = (m) => {
                const arg = Object.assign({}, m);
                if (arg.session) arg.session = 'Session';
                return util
                    .inspect(arg, false, 10, true)
                    .replace(/\n/g, '')
                    .replace(/\s{2,}/g, ' ');
            };
            Logger.log(`${collectionName}.${methodName}(${methodArgs.map(msgMapper).join(', ')})`, 'Mongoose');
        });

        Logger.log('ok', 'DB');
    } catch (e) {
        Logger.error(e, 'DB ERROR');
        throw e;
    }
}
