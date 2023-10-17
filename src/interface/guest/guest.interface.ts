import { Types } from "mongoose"
import IRegisteredGuest from "./registered-guest.interface"
import IVisitingGuest from "./visiting-guest.interface"

export default interface IGuest<T = IRegisteredGuest | IVisitingGuest> {
  refPath: string
  attributes: Types.ObjectId | string | T
}
