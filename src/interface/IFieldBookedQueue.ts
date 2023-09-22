import { Types } from "mongoose"
import IField from "./IField"
import IUser from "./IUser"

export enum EBOOKED_QUEUE_STATUS {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  ACCEPTED = "ACCEPTED"
}
export default interface IFieldBookedQueue {
  field?: Types.ObjectId | IField
  booked_time?: Date
  booked_by?: Types.ObjectId | IUser
  time_count?: number
  status?: EBOOKED_QUEUE_STATUS
}
