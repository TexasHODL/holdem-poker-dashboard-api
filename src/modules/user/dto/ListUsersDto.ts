import { ListUsers } from '@/v1/controller/auth/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class ListUsersDto implements ListUsers {
  @ApiProperty({
    required: false,
  })
  level?: number;
  @ApiProperty({
    required: false,
  })
  _id?: string;
  @ApiProperty({
    required: false,
    examples: [1, 'test'],
  })
  department?: number | string;
  @ApiProperty({
    required: false,
  })
  status?: string;
  @ApiProperty({
    required: false,
  })
  email?: string;
  @ApiProperty({
    required: false,
  })
  name?: string;
  @ApiProperty({
    required: false,
  })
  skip?: number;
  @ApiProperty({
    required: false,
  })
  limit?: number;
}
