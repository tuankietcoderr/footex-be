import { Types } from "mongoose"
import IOrganization from "./IOrganization"

export default interface IField {
  organization?: Types.ObjectId | IOrganization
  name: string
  price?: number
  description?: string
  is_being_used?: boolean
}
