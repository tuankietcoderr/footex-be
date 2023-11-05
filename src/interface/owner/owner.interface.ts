import { EOwnerStatus } from "../../enum"
import IUser from "../user/user.interface"

export default interface IOwner extends IUser {
  status: EOwnerStatus
}
