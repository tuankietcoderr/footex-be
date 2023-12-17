import { Types } from "mongoose"
import IGuest from "./guest/guest.interface"
import ITeam from "./guest/team.interface"
import IBranch from "./owner/branch.interface"
import { EReportStatus } from "../enum"

export default interface IReport<T = ITeam | IBranch> {
  reporter: Types.ObjectId | string | IGuest
  reported: Types.ObjectId | string | T
  reason: string
  status: EReportStatus
  refPath: string
  title: string
}
