import { Types } from "mongoose"
import { EBranchStatus } from "../../enum"
import IOwner from "./owner.interface"

export default interface IBranch {
  name: string
  images: string[]
  logo: string
  phoneNumber: string
  description: string
  openAt: number
  closeAt: number
  status: EBranchStatus
  houseNumber: string
  street: string
  ward: string
  district: string
  city: string
  owner: Types.ObjectId | string | IOwner
}
