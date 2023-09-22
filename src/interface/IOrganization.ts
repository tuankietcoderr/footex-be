import { Types } from "mongoose"
import IUser from "./IUser"

export enum EOrganizationStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
  MAINTAINING = "MAINTAINING"
}

export default interface IOrganization {
  name: string
  images?: string[]
  logo?: string
  address: string
  phone_number?: string
  email?: string
  owner: Types.ObjectId | IUser
  description?: string
  status?: EOrganizationStatus
  active_at: number
  inactive_at: number
}
