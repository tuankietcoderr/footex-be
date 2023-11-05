import { Types } from "mongoose"
import { EInvitementStatus } from "../../enum"
import ITeam from "../guest/team.interface"
import IGuest from "../guest/guest.interface"

export default interface IInvitement {
  from: Types.ObjectId | string | IGuest
  to: Types.ObjectId | string | IGuest
  status: EInvitementStatus
  team: Types.ObjectId | string | ITeam
}
