export interface listLeaderboardPayload {
  startTime?: string;
  endTime?: string;
  leaderboardId?: string;
  leaderboardType?: string;
  _id?: string;
}

export interface getLeaderboardReportCountPayload {
  startTime?: string;
  endTime?: string;
  leaderboardId?: string;
  leaderboardType?: string;
}

export interface findLeaderboardQueryPayload {
  leaderboardId: string;
}

export interface createdByType {
  name: string;
  level: number;
}
export interface tablesType {
  _id: string;
  channelName: string;
  smallBlind: number;
  bigBlind: number;
}

export interface leaderboardDataType {
  leaderboardId: string;
  leaderboardName: string;
  leaderboardType: string;
  startTime: string;
  endTime: string;
  status: string;
  minVipPoints: number;
  minHands: number;
  noOfWinners: number;
  createdAt?: string;
  createdBy: createdByType;
  tables: tablesType[];
  payout: number[];
  description: string;
  termsCondition: string[];
  totalPrizePool: number;
  usedInSet: boolean;
  percentAccumulation: number;
}

export interface findParticipantPayload {
  leaderboardData: leaderboardDataType;
}
