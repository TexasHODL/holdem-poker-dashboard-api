export interface leaderboardSetArray {
  _id?: string;
  leaderboardId: string;
  leaderboardName: string;
  createdAt?: string;
  onView?: boolean;
}

export interface createLeaderboardSetPayload {
  leaderboardSetName: string;
  leaderboardArray: leaderboardSetArray[];
  createdAt?: string;
  onView?: boolean;
}

export interface updateOnViewType {
  onView: boolean;
}

export interface getOneLeaderboardSetQuery {
  leaderboardSetName: string;
}

export interface updateQueryType {
  leaderboardId?: string;
}

export interface updateDataType {
  usedInSet?: boolean;
}

export interface deleteLeaderboardSetQuery {
  leaderboardSetId: string;
}

export interface changeViewOfSetQuery {
  leaderboardSetId: string;
}

export interface leaderboardSetDataType {
  leaderboardSetName: string;
  createdAt?: string;
  leaderboardList: leaderboardSetArray[];
  leaderboardSetId: string;
  onView: boolean;
}

export interface LeaderboardList {
  leaderboardId: string;
  leaderboardName: string;
  onView: boolean;
}

export interface deleteLeaderboardSetPayload {
  _id: string;
  leaderboardSetName: string;
  createdAt: string;
  leaderboardList: LeaderboardList[];
  leaderboardSetId: string;
  onView: boolean;
  editedAt: string;
}

export interface leaderboardSpecificDetailQuery {
  status?: { $in: string };
  _id?: string;
  usedInSet?: boolean;
}

export interface previousSetDataType {
  _id: string;
  leaderboardSetName: string;
  createdAt: string;
  leaderboardList: LeaderboardList[];
  leaderboardSetId: string;
  onView: boolean;
}
export interface updateLeaderboardSetPayload {
  editedAt?: string;
  leaderboardSetName?: string;
  leaderboardArray: LeaderboardList[];
  leaderboardSetId: string;
  previousSetData?: previousSetDataType;
}

export interface changeViewOfSetPayload {
  leaderboardSetId: string;
  onView: boolean;
  leaderboardSet?: previousSetDataType;
}

export interface changeViewOfLeaderboardPayload {
  leaderboardSetId: string;
  leaderboardId: string;
  onView: boolean;
}

export interface changeViewOfLeaderboardQuery {
  leaderboardSetId: string;
  'leaderboardList.leaderboardId': string;
}

export interface udpateLeaderboardSetQuery {
  leaderboardSetName?: string;
  editedAt?: string;
  leaderboardList?: LeaderboardList[];
}
