import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { BaseDto, BaseIdDto, PagingDto } from 'src/common/validation/common.dto';

export class ProjectDto extends BaseDto {
    @ApiProperty({ example: 'Project Alpha', type: String })
    @IsString()
    @IsNotEmpty()
    name: string;

    user_id: Types.ObjectId;
}

export class ProjectGetDto extends PagingDto {}
export class ProjectUpdateDto extends IntersectionType(BaseIdDto, ProjectDto) {}
