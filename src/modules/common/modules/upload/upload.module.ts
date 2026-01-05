import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/common/config/config.service';
import { UserService } from 'src/common/service/user/user.service';
import { UploadController } from './upload.controller';

@Module({
    imports: [JwtModule.register({})],
    controllers: [UploadController],
    providers: [UserService, ConfigService],
})
export class UploadModule {}
