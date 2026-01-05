import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { DOC_FIRST_NAME, DOC_PHONE_NUMBER } from 'src/common/constant/doc.constants';
import { BaseDto, BaseIdDto } from 'src/common/validation/common.dto';

export class UserDto extends BaseDto {
    @ApiProperty({ example: DOC_FIRST_NAME, type: String })
    @Transform(({ value }) => (value ? value?.trim() : value))
    @IsString()
    full_name: string;

    @ApiProperty({ example: DOC_PHONE_NUMBER, type: String })
    @Transform(({ value }) => (value ? '+' + value.replace(/[^0-9]/g, '') : value))
    @IsPhoneNumber()
    phone_number: string;

    @ApiProperty({ example: '123456', type: String })
    @Transform(({ value }) => (value ? value?.trim() : value))
    @MinLength(6)
    @IsString()
    password: string;
}

export class UserLoginDto {
    @ApiProperty({ example: DOC_PHONE_NUMBER, type: String })
    @Transform(({ value }) => (value ? '+' + value.replace(/[^0-9]/g, '') : value))
    @IsPhoneNumber()
    phone_number: string;

    @ApiProperty({ example: '123456', type: String })
    @Transform(({ value }) => (value ? value?.trim() : value))
    @MinLength(6)
    @IsString()
    password: string;
}

export class UserUpdateDto extends IntersectionType(BaseIdDto, PartialType(UserDto)) {}
