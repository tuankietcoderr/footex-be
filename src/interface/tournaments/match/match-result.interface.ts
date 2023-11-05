import { Types } from "mongoose"
import IMatch from "./match.interface"
import IMatchResultDetail from "./match-result-detail.interface"

export default interface IMatchResult {
  match: Types.ObjectId | string | IMatch
  leftTeam: Types.ObjectId | string | IMatchResultDetail
  rightTeam: Types.ObjectId | string | IMatchResultDetail
}
