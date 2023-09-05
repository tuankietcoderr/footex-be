import { Schema, model } from "mongoose";
import { SCHEMA } from "./schema-name";
import ITeam from "../interface/ITeam";

const TeamSchema = new Schema<ITeam>(
  {
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
    logo: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.USERS,
      },
    ],
    name: {
      type: String,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ITeam>(SCHEMA.TEAMS, TeamSchema);
