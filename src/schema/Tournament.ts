import { Schema, model } from 'mongoose'
import { SCHEMA } from './schema-name'
import ITournament from '../interface/ITournament'

const TournamentSchema = new Schema<ITournament>(
  {
    description: {
      type: String
    },
    images: {
      type: [String]
    },
    end_date: {
      type: Date
    },
    start_date: {
      type: Date
    },
    name: {
      type: String
    },
    organizer_id: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.FOOTBALL_SHOPS
    },
    sponsors: [
      {
        type: Object
      }
    ],
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.TEAMS
      }
    ]
  },
  {
    timestamps: true
  }
)

export default model<ITournament>(SCHEMA.TOURNAMENTS, TournamentSchema)
