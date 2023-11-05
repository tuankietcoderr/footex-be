import { Types } from "mongoose"

export default interface ICredential {
  user_id: string | Types.ObjectId
  password: string
}
