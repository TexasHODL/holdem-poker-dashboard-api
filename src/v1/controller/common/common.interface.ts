export interface UserAuthPayload {
  userName: '' | string;
  password: '' | string;
  keyForRakeModules: false | boolean;
}

export interface LoginResponse {
  department: string;
  email: string;
  isParent: string;
  loggedinUserMobileNum: string;
  name: string;
  uniqueSessionId: string;
  role: Role;
  timestamp: number;
  userName: string;
  token: string;
}

export interface Role {
  name: string;
  level: number;
}
export interface CheckUserSession {
  uniqueSessionId: string;
}

export interface Article {
  slug?: string;
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
}

export interface CreateUserPayload {
  createdBy: string;
  module: string[];
  name: string;
  password: string;
  reportingTo: string;
  status: string;
  userName: string;
  role: Role;
}

export interface requiredFields {
  minLength?: { [key: number]: string[] }; // {1:['module', 'userName', 'password'], 4:['message']},
  maxLength?: { [key: number]: string[] }; // {5:['name', 'userName', 'notes'], 10:['message']},
  boolean?: { [key: string]: string[] }; // {"true": ['isActive', 'isEnable']}
  date?: { [key: number]: string[] };
}

export interface reponseObject {
  info?: string;
  success?: boolean;
  status?: number;
  message?: string;
  result?: object;
}
