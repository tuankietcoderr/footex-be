import { Types } from "mongoose"
import { ETeamStatus } from "../../enum"
import IGuest from "./guest.interface"
import ITournament from "../tournaments/tournament.interface"
import IInvitement from "../user/invitement.interface"

export default interface ITeam {
  name: string
  images: string[]
  description: string
  logo: string
  status: ETeamStatus
  captain: Types.ObjectId | string | IGuest
  members: Types.ObjectId[] | string[] | IGuest[]
  jointTournaments: Types.ObjectId[] | string[] | ITournament[]
  joinRequests: Types.ObjectId[] | string[] | IInvitement[]
}
