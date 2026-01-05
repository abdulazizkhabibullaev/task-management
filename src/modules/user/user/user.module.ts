import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/common/config/config.service';
import { UserService } from 'src/common/service/user/user.service';
import { UserController } from './user.controller';

@Module({
    imports: [JwtModule.register({})],
    controllers: [UserController],
    providers: [ConfigService, UserService],
    exports: [UserService, ConfigService],
})
export class UserModule {}
