import { CreateUserPayload, Role } from '@/v1/controller/auth/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UserRoleDto implements Role {
  @ApiProperty()
  name: string;
  @ApiProperty()
  level: number;
}

export class CreateUserDto implements CreateUserPayload {
  @ApiProperty({
    required: true,
  })
  createdBy: string;
  @ApiProperty({
    required: true,
  })
  module: string[];
  @ApiProperty({
    required: true,
  })
  name: string;
  @ApiProperty({
    required: true,
  })
  password: string;
  @ApiProperty({
    required: true,
  })
  reportingTo: string;
  @ApiProperty({
    required: true,
  })
  status: string;
  @ApiProperty({
    required: true,
  })
  userName: string;
  @ApiProperty({
    required: true,
  })
  role: UserRoleDto;
  // @ApiProperty({
  //   required: false
  // })
  // createdAt?: Date | number;
}
