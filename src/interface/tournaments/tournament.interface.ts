import { Types } from "mongoose"
import IBranch from "../owner/branch.interface"
import ITeam from "../guest/team.interface"
import IMatch from "./match/match.interface"
import IPrize from "./prize.interface"

export default interface ITournament {
  name: string
  images: string[]
  description: string
  startAt: Date
  endAt: Date
  branch: Types.ObjectId | string | IBranch
  teams: Types.ObjectId[] | string[] | ITeam[]
  timelines: Types.ObjectId[] | string[] | IMatch[]
  prize: Types.ObjectId | string | IPrize<ITeam>
}
