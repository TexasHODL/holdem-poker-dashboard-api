import { ApiProperty } from '@nestjs/swagger';

export class CountRakebackCommissionData {
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
}
