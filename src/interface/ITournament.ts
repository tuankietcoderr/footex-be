import { Types } from "mongoose";

export interface ISponsor {
  name: string;
  logo?: string;
}

export default interface ITournament {
  name: string;
  images?: string[];
  start_date?: Date;
  end_date?: Date;
  description?: string;
  teams: Types.ObjectId[];
  organizer_id: Types.ObjectId;
  sponsors: ISponsor[];
  //   timelines?:
}
