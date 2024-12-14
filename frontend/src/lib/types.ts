export interface ICommonErrRes {
  message?: string;
  stack?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  pic: string;
  token: string;
}

export interface IChat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  users: IUser[];
  groupAdmin: IUser;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
