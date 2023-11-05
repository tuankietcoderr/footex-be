import { Types } from "mongoose"
import { EBranchStatus } from "../../enum"
import IAddress from "../address.interface"
import IOwner from "./owner.interface"

export default interface IBranch {
  name: string
  images: string[]
  logo: string
  description: string
  openAt: number
  closeAt: number
  status: EBranchStatus
  address: IAddress
  owner: Types.ObjectId | string | IOwner
}
