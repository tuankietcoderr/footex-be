import { Types } from "mongoose"
import IGuest from "../../guest/guest.interface"
import ITeam from "../../guest/team.interface"

export default interface IGoalDetail {
  scoreAtMinute: number
  scoreBy: Types.ObjectId | string | IGuest
  team: Types.ObjectId | string | ITeam
}
