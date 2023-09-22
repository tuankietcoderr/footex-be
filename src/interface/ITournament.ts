import { Types } from "mongoose"
import IOrganization from "./IOrganization"

export interface ISponsor {
  name: string
  logo?: string
}

export default interface ITournament {
  name: string
  images?: string[]
  start_date?: Date
  end_date?: Date
  description?: string
  teams: Types.ObjectId[]
  organizer: Types.ObjectId | IOrganization
  sponsors: ISponsor[]
  //   timelines?:
}
