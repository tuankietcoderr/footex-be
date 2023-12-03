import { Types } from "mongoose"
import { EFieldBookedQueueStatus } from "../../enum"
import IField from "./field.interface"
import IGuest from "../guest/guest.interface"

export default interface IFieldBookedQueue {
  bookedBy: string | Types.ObjectId | IGuest
  startAt: Date
  endAt: Date
  status: EFieldBookedQueueStatus
  field: Types.ObjectId | string | IField
}
