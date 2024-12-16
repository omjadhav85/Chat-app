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

export interface IMessage {
  content: string;
  sentBy: IUser;
  chatId: IChat;
  createdAt: string;
  updatedAt: string;
}

export interface IChat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  users: IUser[];
  groupAdmin: IUser;
  createdAt: string;
  updatedAt: string;
  latestMsg: IMessage | null;
  __v: number;
}
