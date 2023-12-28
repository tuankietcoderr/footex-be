import { Types } from "mongoose"
import { EFieldStatus } from "../../enum"
import IBranch from "./branch.interface"
import IGuest from "../guest/guest.interface"

export default interface IField {
  name: string
  price: number
  image: string
  status: EFieldStatus
  type: number
  branch: Types.ObjectId | string | IBranch
  description: string
  saves: Types.ObjectId[] | string[] | IGuest[]
}
