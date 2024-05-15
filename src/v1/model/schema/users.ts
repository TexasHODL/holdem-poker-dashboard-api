import { PokerDBModel } from '@/database/connections/constants';
import { DBModel } from '@/database/connections/db';
import { getDBModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    emailId: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    userName: {
      type: String,
    },
    isOrganic: {
      type: Boolean,
    },
    ipV4Address: {
      type: String,
    },
    ipV6Address: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    loginMode: {
      type: String,
    },
    googleObject: {
      type: String,
    },
    facebookObject: {
      type: String,
    },
    isParent: {
      type: String,
    },
    isParentUserName: {
      type: String,
    },
    parentType: {
      type: String,
    },
    playerId: {
      type: String,
    },
    address: {
      pincode: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      address2: {
        type: String,
      },
      address1: {
        type: String,
      },
    },
    statistics: {
      bestHand: {
        type: String,
      },
      handsPlayedRM: {
        type: Number,
      },
      handsPlayedPM: {
        type: Number,
      },
      handsWonRM: {
        type: Number,
      },
      handsWonPM: {
        type: Number,
      },
      handsLost: {
        type: Number,
      },
      megaPoints: {
        type: Number,
      },
      megaPointLevel: {
        type: Number,
      },
      countPointsToChips: {
        type: Number,
      },
      countPointsForBonus: {
        type: Number,
      },
    },
    prefrences: {
      tableLayout: {
        type: String,
      },
      autoBuyIn: {
        type: String,
      },
      autoBuyInAmountInPercent: {
        type: String,
      },
      cardColor: {
        type: Boolean,
      },
    },
    settings: {
      seatPrefrence: {
        type: Number,
      },
      seatPrefrenceTwo: {
        type: Number,
      },
      seatPrefrenceSix: {
        type: Number,
      },
      muteGameSound: {
        type: Boolean,
      },
      dealerChat: {
        type: Boolean,
      },
      playerChat: {
        type: Boolean,
      },
      runItTwice: {
        type: Boolean,
      },
      avatarId: {
        type: Number,
      },
      tableColor: {
        type: Number,
      },
    },
    buildAccess: {
      androidApp: {
        type: Boolean,
      },
      iosApp: {
        type: Boolean,
      },
      mac: {
        type: Boolean,
      },
      browser: {
        type: Boolean,
      },
      windows: {
        type: Boolean,
      },
      website: {
        type: Boolean,
      },
    },
    isEmailVerified: {
      type: Boolean,
    },
    isMobileNumberVerified: {
      type: Boolean,
    },
    isNewUser: {
      type: Boolean,
    },
    isBlocked: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    isMuckHand: {
      type: Boolean,
    },
    dailyBonusCollectionTime: {
      type: Number,
    },
    previousBonusCollectedTime: {
      type: Number,
    },
    lastLogin: {
      type: Number,
    },
    profilelastUpdated: {
      type: String,
    },
    freeChips: {
      type: Number,
    },
    realChips: {
      type: Number,
    },
    instantBonusAmount: {
      type: Number,
    },
    claimedInstantBonus: {
      type: Number,
    },
    passwordResetToken: {
      type: String,
    },
    isResetPasswordTokenExpire: {
      type: String,
    },
    emailVerificationToken: {
      type: String,
    },
    isEmailVerificationTokenExpire: {
      type: Boolean,
    },
    loyalityRakeLevel: {
      type: Number,
    },
    isBot: {
      type: Boolean,
    },
    offers: {
      type: [Boolean],
    },
    tournaments: {
      type: [Boolean],
    },
    letter: {
      type: [Boolean],
    },
    anouncement: {
      type: [Boolean],
    },
    chipsManagement: {
      deposit: {
        type: Number,
      },
      withdrawl: {
        type: Number,
      },
      withdrawlPercent: {
        type: Number,
      },
      withdrawlCount: {
        type: Number,
      },
      withdrawlDate: {
        type: Number,
      },
    },
    rakeBack: {
      type: Number,
    },
    promoBonusAwarded: {
      type: Boolean,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
    sponserId: {
      type: String,
    }
  },
  {
    versionKey: false,
    strict: false,
    // timestamps: { createdAt: true, updatedAt: true },
  },
);

export const getModel = () => getDBModel(PokerDBModel.User);
export default getModel;
// export default model('Users', userSchema, 'users');
