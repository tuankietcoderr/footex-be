import { Schema, model } from "mongoose"
import { ICardFine } from "../interface"
import { ECard } from "../enum"
import { SCHEMA } from "./schema-name"

const CardFineModel = new Schema<ICardFine>(
  {
    cards: [
      {
        type: String,
        enum: Object.values(ECard)
      }
    ],
    player: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.GUESTS
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.MATCHES
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<ICardFine>(SCHEMA.CARD_FINES, CardFineModel, SCHEMA.CARD_FINES)
