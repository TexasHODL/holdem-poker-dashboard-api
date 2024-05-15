import { PokerDBModel } from '@/database/connections/constants';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const tableSchema = new Schema(
  {
    isRealMoney: {
      type: Boolean,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    turnTime: {
      type: Number,
      required: true,
    },
    isPotLimit: {
      type: Boolean,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    smallBlind: {
      type: Number,
      required: true,
    },
    bigBlind: {
      type: Number,
      required: true,
    },
    isStraddleEnable: {
      type: Boolean,
    },
    minBuyIn: {
      type: Number,
      required: true,
    },
    maxBuyIn: {
      type: Number,
      required: true,
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
        type: String,
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
    flopPercent: {
      type: Number,
    },
    avgStack: {
      type: Number,
    },
    // createdAt: {
    //   type: Number,
    // },
    // updatedAt: {
    //   type: Number,
    // },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getDBModel(PokerDBModel.Table);
export default getModel;
// export default model('Tables', tableSchema, 'tables');
