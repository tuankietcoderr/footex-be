import { Types } from "mongoose"

export default interface ICredential {
  userId: string | Types.ObjectId
  password: string
}
