import { Types } from "mongoose"
import IBranch from "../owner/branch.interface"
import ITeam from "../guest/team.interface"
import IMatch from "./match/match.interface"
import IPrize from "./prize.interface"
import { ETournamentStatus } from "../../enum"

export default interface ITournament {
  name: string
  images: string[]
  description: string
  startAt: Date
  endAt: Date
  branch: Types.ObjectId | string | IBranch
  teams: Types.ObjectId[] | string[] | ITeam[]
  matches: Types.ObjectId[] | string[] | IMatch[]
  prize: Types.ObjectId | string | IPrize<ITeam>
  status: ETournamentStatus
}
