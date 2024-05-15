import {
  countDirectEntryHistoryPayload,
  createLeaderboardPayload,
  deleteLeaderboardPayload,
  directEntryHistoryPayload,
  directEntryPayload,
  editLeaderboardPayload,
  leaderboardParticipantsPayload,
} from './leaderboardManagementInterface';

export const createLeaderboardRequest: createLeaderboardPayload = {
  leaderboardName: '',
  leaderboardType: '',
  startTime: '',
  endTime: '',
  description: '',
  minVipPoints: 0,
  minHands: 0,
  noOfWinners: 0,
  createdBy: {
    name: '',
    level: 0,
  },
  tables: [
    {
      _id: '',
      channelName: '',
      smallBlind: 0,
      bigBlind: 0,
    },
  ],
  payout: [0],
  totalPrizePool: 0,
  percentAccumulation: 0,
};

export const deleteLeaderboardRequest: deleteLeaderboardPayload = {
  id: '',
  bonusCodeChanged: false,
  leaderboardData: {
    _id: '',
    status: '',
    leaderboardId: '',
    leaderboardName: '',
    leaderboardType: '',
    startTime: '',
    endTime: '',
    description: '',
    minVipPoints: 0,
    minHands: 0,
    noOfWinners: 0,
    createdBy: {
      name: '',
      level: 0,
    },
    tables: [
      {
        _id: '',
        channelName: '',
        smallBlind: 0,
        bigBlind: 0,
      },
    ],
    payout: [],
    termsCondition: [],
    totalPrizePool: 0,
    usedInSet: false,
    percentAccumulation: 0,
  },
};

export const editLeaderboardRequest: editLeaderboardPayload = {
  id: '',
  leaderboardName: '',
  leaderboardType: '',
  startTime: '',
  endTime: '',
  description: '',
  minVipPoints: 0,
  tables: [
    {
      _id: '',
      channelName: '',
      smallBlind: 0,
      bigBlind: 0,
    },
  ],
  totalPrizePool: 0,
  percentAccumulation: 0,
  noOfWinners: 0,
  payout: [0],
  termsCondition: [],
  updatedBy: {
    name: '',
    level: 0,
  },
};

export const directEntryRequest: directEntryPayload = {
  userName: '',
  bonusCode: '',
};

export const countDirectEntryHistoryRequest: countDirectEntryHistoryPayload = {
  bonusCode: '',
};

export const directEntryHistoryRequest: directEntryHistoryPayload = {
  skip: 0,
  limit: 20,
  bonusCode: '',
};

export const leaderboardParticipantsRequest: leaderboardParticipantsPayload = {
  leaderboardId: '',
  status: '',
};
