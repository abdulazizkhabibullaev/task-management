import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TaskService } from 'src/common/service/task/task.service';
import { UserModule } from '../user/user.module';
import { TaskController } from './task.controller';

@Module({
    imports: [JwtModule.register({}), UserModule],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {}
