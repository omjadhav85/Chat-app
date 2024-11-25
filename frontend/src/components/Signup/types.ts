import { ICommonErrRes } from "@/lib/types";

export interface ISignUpReqDTO {
  name: string;
  email: string;
  password: string;
  pic?: string;
}

export interface ISignUpResponseDTO extends ICommonErrRes {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  pic: string;
  token: string;
}
