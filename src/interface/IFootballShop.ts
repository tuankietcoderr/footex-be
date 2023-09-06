import { Types } from "mongoose"

export enum EFootballShopStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  MAINTAINING = "MAINTAINING"
}

export default interface IFootballShop {
  name: string
  images?: string[]
  logo?: string
  address: string
  phone_number?: string
  email?: string
  owner_id?: Types.ObjectId
  description?: string
  status?: EFootballShopStatus
  active_at: number
  inactive_at: number
}
