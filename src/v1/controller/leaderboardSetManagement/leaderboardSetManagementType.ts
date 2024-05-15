import {
  changeViewOfLeaderboardPayload,
  changeViewOfSetPayload,
  createLeaderboardSetPayload,
  deleteLeaderboardSetPayload,
  updateLeaderboardSetPayload,
} from './leaderboardSetManagementInterface';

export const createLeaderboardSetRequest: createLeaderboardSetPayload = {
  leaderboardSetName: '',
  leaderboardArray: [
    {
      _id: '',
      leaderboardId: '',
      leaderboardName: '',
    },
  ],
};

export const deleteLeaderboardSetRequest: deleteLeaderboardSetPayload = {
  _id: '',
  leaderboardSetName: '',
  createdAt: '',
  leaderboardList: [
    {
      leaderboardId: '',
      leaderboardName: '',
      onView: false,
    },
  ],
  leaderboardSetId: '',
  onView: false,
  editedAt: '',
};

export const updateLeaderboardSetRequest: updateLeaderboardSetPayload = {
  leaderboardArray: [
    {
      leaderboardId: '',
      leaderboardName: '',
      onView: false,
    },
  ],
  leaderboardSetId: '',
};

export const changeViewOfSetRequest: changeViewOfSetPayload = {
  leaderboardSetId: '',
  onView: false,
};

export const changeViewOfLeaderboardRequest: changeViewOfLeaderboardPayload = {
  leaderboardSetId: '',
  leaderboardId: '',
  onView: false,
};
