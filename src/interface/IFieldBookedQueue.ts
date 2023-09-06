import { Types } from 'mongoose'

export enum EBOOKED_QUEUE_STATUS {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  ACCEPTED = 'ACCEPTED'
}
export default interface IFieldBookedQueue {
  field_id?: Types.ObjectId
  booked_time?: Date
  booked_by?: Types.ObjectId
  time_count?: number
  status?: EBOOKED_QUEUE_STATUS
}
