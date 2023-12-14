import { Types } from "mongoose"
import ITeam from "../guest/team.interface"
import IField from "../owner/field.interface"
import IBranch from "../owner/branch.interface"
import IGuest from "../guest/guest.interface"
import { ERate } from "../../enum"

export default interface IRate<T = IBranch | ITeam | IField> {
  valuer: Types.ObjectId | string | IGuest
  rateValue: number
  object: Types.ObjectId | string | T
  refPath: string
  description: string
}
