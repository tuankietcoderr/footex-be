import { Types } from "mongoose";

export default interface IFieldBookedQueue {
  field_id?: Types.ObjectId;
  booked_time?: Date;
  booked_by?: Types.ObjectId;
}
