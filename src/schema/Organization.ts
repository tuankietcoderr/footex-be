import { Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import IOrganization, { EOrganizationStatus } from "../interface/IOrganization"

const OrganizationSchema = new Schema<IOrganization>(
  {
    email: {
      type: String
    },
    images: {
      type: [String]
    },
    logo: {
      type: String
    },
    name: {
      type: String
    },
    address: {
      type: String
    },
    phone_number: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS
    },
    description: {
      type: String
    },
    status: {
      type: String
    },
    active_at: {
      type: Number
    },
    inactive_at: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

export default model<IOrganization>(SCHEMA.ORGANIZATIONS, OrganizationSchema)
