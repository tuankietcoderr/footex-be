import { Types } from "mongoose";

export default interface IField {
  footballshop_id?: Types.ObjectId;
  name: string;
  price?: number;
  description?: string;
  is_being_used?: boolean;
}
