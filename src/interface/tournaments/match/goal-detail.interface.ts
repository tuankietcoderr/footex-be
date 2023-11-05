import { Types } from "mongoose"
import IGuest from "../../guest/guest.interface"

export default interface IGoalDetail {
  scoreAtMinute: number
  scoreBy: Types.ObjectId | string | IGuest
}
