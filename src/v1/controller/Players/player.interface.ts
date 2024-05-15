export interface PlayerListRequestPayLoad {
  location: any;
  cookies: any;
  window: any;
  rootScope: any;
  scope: any;
  stateParams: any;
  http: any;
  timeout: any;
  CSVService: any;
}

export interface scopePayLoad {
  number: number;
  pageSize: number;
  currentPage: number;
  totalPage: number;
  setHidden: boolean;
  setDisabledForSubAff: boolean;
  status: string;
  timeSort: number;
  lastActiveSort: number;
  userLoggedIn: string;
}
