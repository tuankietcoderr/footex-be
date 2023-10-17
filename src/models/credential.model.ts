import { Schema, model } from "mongoose"
import ICredential from "../interface/user/credential.interface"
import { SCHEMA } from "./schema-name"

const CredentialModel = new Schema<ICredential>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS
    },
    password: {
      type: String
    }
  },
  {
    versionKey: false
  }
)

export default model<ICredential>(SCHEMA.CREDENTIALS, CredentialModel, SCHEMA.CREDENTIALS)
