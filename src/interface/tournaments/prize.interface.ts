import { Types } from "mongoose"
import ITournament from "./tournament.interface"
import IUser from "../user/user.interface"
import ITeam from "../guest/team.interface"
import IGuest from "../guest/guest.interface"

export default interface IPrize<T = IGuest | ITeam> {
  name: string
  image: string
  description: string
  refPath: string // user or team
  tournament: Types.ObjectId | string | ITournament
  winner: Types.ObjectId | string | T
}
