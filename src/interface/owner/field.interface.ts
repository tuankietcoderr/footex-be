import { Types } from "mongoose"
import { EFieldStatus } from "../../enum"
import IBranch from "./branch.interface"

export default interface IField {
  name: string
  price: number
  image: string
  status: EFieldStatus
  type: number
  branch: Types.ObjectId | string | IBranch
}
