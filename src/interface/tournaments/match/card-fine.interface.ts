import { Types } from "mongoose"
import IGuest from "../../guest/guest.interface"
import { ECard } from "../../../enum"
import IMatch from "./match.interface"

export default interface ICardFine {
  cards: ECard[]
  player: Types.ObjectId | string | IGuest
  match: Types.ObjectId | string | IMatch
}
