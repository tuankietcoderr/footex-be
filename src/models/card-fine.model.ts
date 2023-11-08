import { Schema, model } from "mongoose"
import { ICardFine } from "../interface"
import { ECard } from "../enum"
import { SCHEMA } from "./schema-name"

const CardFineModel = new Schema<ICardFine>(
  {
    cards: [
      {
        type: String,
        enum: Object.values(ECard),
        default: null
      }
    ],
    fine: {
      type: String
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.MATCHES
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.GUESTS
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<ICardFine>(SCHEMA.CARD_FINES, CardFineModel, SCHEMA.CARD_FINES)
