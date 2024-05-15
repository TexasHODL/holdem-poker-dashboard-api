import {
  CreateAffiliatePayload,
  CreatedBy,
  Role,
} from '@/v1/controller/auth/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewAffiliateDto implements CreateAffiliatePayload {
  @ApiProperty({
    required: true,
  })
  name: string;
  @ApiProperty({
    required: true,
  })
  userName: string;
  @ApiProperty({
    required: true,
  })
  mobile: any;
  @ApiProperty({
    required: true,
  })
  email: string;
  @ApiProperty({
    required: true,
  })
  password: string;
  @ApiProperty({
    required: true,
  })
  role: Role;
  @ApiProperty({
    required: true,
  })
  dob: any;
  @ApiProperty({
    required: true,
  })
  creditLimit: string;
  @ApiProperty({
    required: true,
  })
  cityName: string;
  @ApiProperty({
    required: true,
  })
  rakeCommision: number;
  @ApiProperty({
    required: true,
  })
  realChips: number;
  @ApiProperty({
    required: true,
  })
  profit: number;
  @ApiProperty({
    required: true,
  })
  withdrawal: number;
  @ApiProperty({
    required: true,
  })
  status: string;
  @ApiProperty({
    required: true,
  })
  address: string;
  @ApiProperty({
    required: true,
  })
  createdBy: CreatedBy;
  @ApiProperty({
    required: true,
  })
  createdAt: number;
  @ApiProperty({
    required: true,
  })
  upDateAt: number;
  @ApiProperty({
    required: true,
  })
  withdrawalChips: number;
  @ApiProperty({
    required: true,
  })
  pulledRealChips: number;
  @ApiProperty({
    required: true,
  })
  deposit: number;
  @ApiProperty({
    required: true,
  })
  module: string[];
}
