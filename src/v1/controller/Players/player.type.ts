import { requiredFields } from '../common/common.interface';
import { v4 as uuidv4 } from 'uuid';
import { PlayerListRequestPayLoad, scopePayLoad } from './player.interface';

export const playerListRequest: PlayerListRequestPayLoad = {
  location: '',
  cookies: '',
  window: '',
  rootScope: '',
  scope: '',
  stateParams: '',
  http: '',
  timeout: '',
  CSVService: '',
};
export const scope: scopePayLoad = {
  number: 1,
  pageSize: 20,
  currentPage: 1,
  totalPage: 0,
  setHidden: false,
  setDisabledForSubAff: false,
  status: 'Active',
  timeSort: 1,
  lastActiveSort: 1,
  userLoggedIn: '',
};
