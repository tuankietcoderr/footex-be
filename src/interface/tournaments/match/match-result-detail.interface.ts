import { Types } from "mongoose"
import IGoalDetail from "./goal-detail.interface"
import ITeam from "../../guest/team.interface"

export default interface IMatchResultDetail {
  goals: Types.ObjectId[] | string[] | IGoalDetail[]
  team: Types.ObjectId | string | ITeam
}
