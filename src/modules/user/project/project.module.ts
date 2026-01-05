import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProjectService } from 'src/common/service/project/project.service';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './project.controller';

@Module({
    imports: [JwtModule.register({}), UserModule, TaskModule],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}
