import { Types } from "mongoose"
import IMatch from "./match.interface"
import IGuest from "../../guest/guest.interface"
import { ECard } from "../../../enum"

export default interface ICardFine {
  fine: string
  cards: ECard
  player: Types.ObjectId | string | IGuest
  match: Types.ObjectId | string | IMatch
}
