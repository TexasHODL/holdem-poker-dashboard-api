export class CreateTableDto {
  isRealMoney: boolean;
  channelName: string;
  turnTime: string;
  isPotLimit: boolean;
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  isStraddleEnable: boolean;
  minBuyIn: number;
  maxBuyIn: number;
  numberOfRebuyAllowed: number;
  hourLimitForRebuy: number;
  rebuyHourFactor: number;
  gameInfo: object;
  gameInterval: number;
  createdBy: string;
  rake: object;
  channelVariation: string;
  minPlayers: number;
}
