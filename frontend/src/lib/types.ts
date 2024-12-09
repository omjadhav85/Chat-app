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
