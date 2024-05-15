import { Test } from '@nestjs/testing';
import { PlayerRakeBackDto } from '../dto/player-rake-back.dto';
import { PlayerRakeBackController } from '../player-rake-back.controller';
import { PlayerRakeBackService } from '../service/player-rake-back.service';
import { fundrakeStub } from './stubs/player-rake-back.stub';

jest.mock('../player-rake-back.service');

describe('PlayerRakeBackController', () => {
  let playerRakeBackController: PlayerRakeBackController;
  let playerRakeBackService: PlayerRakeBackService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [PlayerRakeBackController],
      providers: [PlayerRakeBackService],
    }).compile();

    playerRakeBackController = moduleRef.get<PlayerRakeBackController>(
      PlayerRakeBackController,
    );
    playerRakeBackService = moduleRef.get<PlayerRakeBackService>(
      PlayerRakeBackService,
    );
    jest.clearAllMocks();
  });

  describe('playerRakeBack', () => {
    // let playerRakeBack: any;
    // beforeEach(async () => {
    //     playerRakeBack = await playerRakeBackController.playerRakeBack()
    // });
    test('then it should call playerRakeBackService', async () => {
      const playerRakeBackDto: PlayerRakeBackDto = {
        rakeByUsername: 'testagent01',
        startDate: 1649149200000,
        endDate: 1666579500000,
        skip: 0,
        limit: 20,
      };
      const rakeData = await playerRakeBackController.playerRakeBack(
        playerRakeBackDto,
      );
      expect(playerRakeBackService.playerRakeBackReport).toBeCalled();
      expect(playerRakeBackService.playerRakeBackReport).toBeCalledWith(
        playerRakeBackDto,
      );
    });
  });
});
