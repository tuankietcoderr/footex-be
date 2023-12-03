import { Types } from "mongoose"
import ITeam from "../guest/team.interface"
import IGuest from "../guest/guest.interface"
import IBranch from "../owner/branch.interface"

export default interface IPrize<T = IGuest | ITeam> {
  name: string
  image: string
  description: string
  branch: Types.ObjectId | string | IBranch
  winners: Types.ObjectId[] | string[] | T[]
  value: number
}
