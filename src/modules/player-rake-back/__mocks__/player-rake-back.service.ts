import {
  fundrakeStub,
  rakeDetailsFromPlayerStub,
  totalRakeGeneratedStub,
} from '../test/stubs/player-rake-back.stub';

export const PlayerRakeBackService = jest.fn().mockReturnValue({
  playerRakeBackReport: jest.fn().mockResolvedValue(fundrakeStub()),
  checkPlayerWithUsername: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
  findRakeDetailsFromPlayer: jest
    .fn()
    .mockResolvedValue(rakeDetailsFromPlayerStub()),
  findTotalRakeGenerated: jest.fn().mockResolvedValue(totalRakeGeneratedStub()),
});
