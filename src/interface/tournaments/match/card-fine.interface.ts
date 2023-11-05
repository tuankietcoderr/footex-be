import { Types } from "mongoose"
import ICard from "./card.interface"
import IMatch from "./match.interface"
import IGuest from "../../guest/guest.interface"

export default interface ICardFine {
  fine: string
  cards: Types.ObjectId[] | string[] | ICard[]
  player: Types.ObjectId | string | IGuest
  match: Types.ObjectId | string | IMatch
}
