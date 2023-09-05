import { Types } from "mongoose";

export default interface ICredential {
  userId: Types.ObjectId;
  password: string;
}
