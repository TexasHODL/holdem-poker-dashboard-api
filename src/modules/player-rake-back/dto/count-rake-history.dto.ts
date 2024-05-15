import { ApiProperty } from '@nestjs/swagger';

export class CountRakebackHistoryData {
    @ApiProperty({
        example: Date.now(),
        required: false,
    })
    from?: Date;

    @ApiProperty({
        example: Date.now(),
        required: false,
    })
    to?: Date;

    @ApiProperty()
    userName?: String;
    
    @ApiProperty({
        example: Date.now(),
        required: false,
    })
    createdAt?: Date;
}
