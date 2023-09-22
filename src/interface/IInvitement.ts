import { Types } from "mongoose"
import IUser from "./IUser"
import ITeam from "./ITeam"

export enum EInvitementStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export default interface IInvitement {
  title: string
  owner_title: string
  team: Types.ObjectId | ITeam
  user: Types.ObjectId | IUser
  status: EInvitementStatus
}
