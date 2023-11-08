import { Types } from "mongoose"
import IUser from "../user/user.interface"
import { EGuestStatus } from "../../enum"

export default interface IGuest extends IUser {
  status: EGuestStatus
}
