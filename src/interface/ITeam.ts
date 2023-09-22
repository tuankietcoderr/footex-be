import { Types } from "mongoose"
import IUser from "./IUser"

export default interface ITeam {
  name: string
  logo?: string
  description?: string
  images?: string[]
  members: Types.ObjectId[]
  owner: Types.ObjectId | IUser
}
