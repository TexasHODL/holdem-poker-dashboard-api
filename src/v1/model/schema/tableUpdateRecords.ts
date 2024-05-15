import { LogDBModel } from '@/database/connections/constants';
import { getLogModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const tableUpdateRecordSchema = new Schema(
  {
    existingTableData: {
      _id: {
        type: Schema.Types.ObjectId,
      },
      isRealMoney: {
        type: Boolean,
      },
      channelName: {
        type: String,
      },
      turnTime: {
        type: Number,
      },
      isPotLimit: {
        type: Boolean,
      },
      maxPlayers: {
        type: Number,
      },
      smallBlind: {
        type: Number,
      },
      bigBlind: {
        type: Number,
      },
      isStraddleEnable: {
        type: Boolean,
      },
      minBuyIn: {
        type: Number,
      },
      maxBuyIn: {
        type: Number,
      },
      numberOfRebuyAllowed: {
        type: Number,
      },
      hourLimitForRebuy: {
        type: Number,
      },
      rebuyHourFactor: {
        type: Number,
      },
      gameInfo: {
        TableName: {
          type: String,
        },
        GameVariation: {
          type: String,
        },
        ChipsType: {
          type: String,
        },
        BuyIn: {
          type: String,
        },
        Stakes: {
          type: String,
        },
        Rake: {
          type: Date,
        },
        RakeMultiPlayers: {
          type: Date,
        },
        RakeHeadsUp: {
          type: Date,
        },
        CapAmount: {
          type: Number,
        },
        MaxPlayers: {
          type: Number,
        },
        Straddle: {
          type: String,
        },
        TurnTime: {
          type: String,
        },
        AntiBanking: {
          type: String,
        },
      },
      gameInterval: {
        type: Number,
      },
      createdBy: {
        type: String,
      },
      rake: {
        rakePercentTwo: {
          type: Number,
        },
        rakePercentThreeFour: {
          type: Number,
        },
        rakePercentMoreThanFive: {
          type: Number,
        },
        capTwo: {
          type: Number,
        },
        capThreeFour: {
          type: Number,
        },
        capMoreThanFive: {
          type: Number,
        },
        minStake: {
          type: Number,
        },
        maxStake: {
          type: Number,
        },
      },
      channelVariation: {
        type: String,
      },
      minPlayers: {
        type: Number,
      },
      isPrivateTabel: {
        type: Boolean,
      },
      favourite: {
        type: Boolean,
      },
      isRunItTwice: {
        type: Boolean,
      },
      isActive: {
        type: Boolean,
      },
      channelType: {
        type: String,
      },
      totalGame: {
        type: Number,
      },
      totalPot: {
        type: Number,
      },
      avgPot: {
        type: Number,
      },
      totalPlayer: {
        type: Number,
      },
      totalFlopPlayer: {
        type: Number,
      },
      avgFlopPercent: {
        type: Number,
      },
      totalStack: {
        type: Number,
      },
      blindMissed: {
        type: Number,
      },
      gameInfoString: {
        type: String,
      },
      createdAt: {
        type: Number,
      },
      flopPercent: {
        type: Number,
      },
      avgStack: {
        type: Number,
      },
    },
    updateTableData: {
      _id: {
        type: String,
      },
      isRealMoney: {
        type: Boolean,
      },
      channelName: {
        type: String,
      },
      turnTime: {
        type: Number,
      },
      isPotLimit: {
        type: Boolean,
      },
      maxPlayers: {
        type: Number,
      },
      smallBlind: {
        type: Number,
      },
      bigBlind: {
        type: Number,
      },
      isStraddleEnable: {
        type: Boolean,
      },
      minBuyIn: {
        type: Number,
      },
      maxBuyIn: {
        type: Number,
      },
      numberOfRebuyAllowed: {
        type: Number,
      },
      hourLimitForRebuy: {
        type: Number,
      },
      rebuyHourFactor: {
        type: Number,
      },
      gameInfo: {
        TableName: {
          type: String,
        },
        GameVariation: {
          type: String,
        },
        ChipsType: {
          type: String,
        },
        BuyIn: {
          type: String,
        },
        Stakes: {
          type: String,
        },
        Rake: {
          type: Date,
        },
        RakeMultiPlayers: {
          type: Date,
        },
        RakeHeadsUp: {
          type: Date,
        },
        CapAmount: {
          type: Number,
        },
        MaxPlayers: {
          type: Number,
        },
        Straddle: {
          type: String,
        },
        TurnTime: {
          type: String,
        },
        AntiBanking: {
          type: String,
        },
      },
      gameInterval: {
        type: Number,
      },
      createdBy: {
        type: String,
      },
      rake: {
        rakePercentTwo: {
          type: Number,
        },
        rakePercentThreeFour: {
          type: Number,
        },
        rakePercentMoreThanFive: {
          type: Number,
        },
        capTwo: {
          type: Number,
        },
        capThreeFour: {
          type: Number,
        },
        capMoreThanFive: {
          type: Number,
        },
        minStake: {
          type: Number,
        },
        maxStake: {
          type: Number,
        },
      },
      channelVariation: {
        type: String,
      },
      minPlayers: {
        type: Number,
      },
      isPrivateTabel: {
        type: Boolean,
      },
      favourite: {
        type: Boolean,
      },
      isRunItTwice: {
        type: Boolean,
      },
      isActive: {
        type: Boolean,
      },
      channelType: {
        type: String,
      },
      totalGame: {
        type: Number,
      },
      totalPot: {
        type: Number,
      },
      avgPot: {
        type: Number,
      },
      totalPlayer: {
        type: Number,
      },
      totalFlopPlayer: {
        type: Number,
      },
      avgFlopPercent: {
        type: Number,
      },
      totalStack: {
        type: Number,
      },
      blindMissed: {
        type: Number,
      },
      gameInfoString: {
        type: String,
      },
      createdAt: {
        type: Number,
      },
      flopPercent: {
        type: Number,
      },
      avgStack: {
        type: Number,
      },
      updatedAt: {
        type: Number,
      },
      updatedBy: {
        type: String,
      },
    },
    channelId: {
      type: Schema.Types.ObjectId,
    },
    updatedBy: {
      type: String,
    },
    updatedByRole: {
      name: {
        type: String,
      },
      level: {
        type: Number,
      },
    },
    updatedFromIp: {
      type: String,
    },
    updatedFromDevice: {
      type: String,
    },
    updateFieldsString: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getLogModel(LogDBModel.TableUpdateRecord);
export default getModel;

// export default model(
//   'TableUpdateRecords',
//   tableUpdateRecordSchema,
//   'tableUpdateRecords',
// );
