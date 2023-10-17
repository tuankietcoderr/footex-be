import { Types } from "mongoose"
import { ERole } from "../../enum"
import IAdmin from "../admin/admin.interface"
import IGuest from "../guest/guest.interface"
import IOwner from "../owner/owner.interface"

export default interface IUser<T = IGuest | IAdmin | IOwner> {
  password: string
  name: string
  email: string
  avatar: string
  phoneNumber: string
  isEmailVerified: boolean
  role: ERole
  refPath: string
  attributes: Types.ObjectId | string | T
}
