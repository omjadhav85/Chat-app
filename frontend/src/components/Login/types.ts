import { ICommonErrRes } from "@/lib/types";

export interface ILoginReqDTO {
  email: string;
  password: string;
}

export interface ILoginResponseDTO extends ICommonErrRes {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  pic: string;
  token: string;
}
