import { Types } from "mongoose"
import ITournament from "../tournament.interface"
import IField from "../../owner/field.interface"
import ITeam from "../../guest/team.interface"

export default interface IMatch {
  tournament: Types.ObjectId | string | ITournament
  field: Types.ObjectId | string | IField
  startAt: Date
  endAt: Date
  leftTeam: Types.ObjectId | string | ITeam
  rightTeam: Types.ObjectId | string | ITeam
}
