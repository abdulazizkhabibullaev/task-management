import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import md5 from 'md5';
import { ConfigService } from 'src/common/config/config.service';
import { UserError } from 'src/common/db/models/user/user.error';
import { UserService } from 'src/common/service/user/user.service';
import { CustomRequest } from 'src/common/types/common.types';
import { AuthGuard } from 'src/modules/common/guard/auth.guard';
import { UserDto, UserLoginDto } from './user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    @Post('register')
    async register(@Body() dto: UserDto) {
        const user = await this.userService.save(dto);

        return {
            ...user.toObject(),
            token: await this.jwtService.signAsync(
                { phone_number: user.phone_number },
                {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_EXPIRES'),
                },
            ),
        };
    }

    @Post('login')
    async login(@Body() dto: UserLoginDto) {
        const user = await this.userService.getByPhoneNumber(dto.phone_number);
        if (user.password !== md5(dto.password)) throw UserError.InvalidPassword(dto.password);

        return {
            ...user,
            token: await this.jwtService.signAsync(
                { phone_number: user.phone_number },
                {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_EXPIRES'),
                },
            ),
        };
    }

    @Get('profile')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getMe(@Req() req: CustomRequest) {
        return req.user;
    }
}
