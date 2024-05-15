import { ApiProperty } from '@nestjs/swagger';

export class ListRakebackCommissionData {
    @ApiProperty({
        example: Date.now(),
        required: false,
    })
    timestamp?: Date;

    @ApiProperty()
    username?: string;

    @ApiProperty()
    RakeGenerated?: number;

    @ApiProperty()
    HandId?: string;

    @ApiProperty()
    GameType?: string;

    @ApiProperty()
    TableName?: string;
  
    @ApiProperty()
    limit?: number;

    @ApiProperty()
    skip?: number;
}
