import { ApiProperty } from "@nestjs/swagger";

export class TransactionHistoryOfPlayer {
    @ApiProperty({
        description: 'The email of filter',
    })
    email?: string;
    @ApiProperty({
        description: 'The mobile number of filter',
    })
    mobileNumber?: string;
    @ApiProperty({
        description: 'The transactionId of filter',
    })
    transactionId?: string;
    @ApiProperty({
        description: 'The username of filter',
    })
    userName?: string;

    @ApiProperty()
    limit?: number;

    @ApiProperty()
    skip?: number;

    @ApiProperty()
    sortValue?: string;
}