import { Types } from "mongoose"
import { CustomError, HttpStatusCode } from "../helper"
import { IMatch } from "../interface"
import { MatchModel, TournamentModel } from "../models"
import BaseController from "./base.controller"
import FieldController from "./field.controller"
import TeamController from "./team.controller"
import TournamentController from "./tournament.controller"

class MatchController extends BaseController {
  constructor() {
    super()
  }

  static async validate(matchId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const match = await MatchModel.findById(matchId)
      if (!match) {
        return Promise.reject(new CustomError("Trận đấu không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      return match
    })
  }

  static async getById(matchId: string) {
    return await this.validate(matchId)
  }

  static async create(body: IMatch) {
    return await super.handleResponse(async () => {
      const { tournament, startAt, endAt, field, leftTeam, rightTeam } = body
      await FieldController.validate(field as string)
      await TeamController.validate(leftTeam as string)
      await TeamController.validate(rightTeam as string)

      if (startAt > endAt) {
        return Promise.reject(
          new CustomError("Ngày bắt đầu không được lớn hơn ngày kết thúc!", HttpStatusCode.BAD_REQUEST)
        )
      }

      const overlapMatch = await MatchModel.find({
        field,
        startAt: { $lte: endAt },
        endAt: { $gte: startAt }
      })

      if (overlapMatch.length > 0) {
        return Promise.reject(new CustomError("Trận đấu đã bị trùng lịch!", HttpStatusCode.BAD_REQUEST))
      }

      const match = new MatchModel(body)
      if (!match) {
        return Promise.reject(new CustomError("Trận đấu chưa được tạo thành công!", HttpStatusCode.BAD_REQUEST))
      }
      await TournamentController.addToTimeline(tournament as string, match._id)
      await match.save()
      return match
    })
  }

  static async update(matchId: string, body: IMatch) {
    return await super.handleResponse(async () => {
      const match = await MatchModel.findByIdAndUpdate(matchId, { $set: body }, { new: true, runValidators: true })
      if (!match) {
        return Promise.reject(new CustomError("Trận đấu không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      return match
    })
  }

  static async getMatchesByTournament(tournamentId: string) {
    return await super.handleResponse(async () => {
      await TournamentController.validate(tournamentId)
      const matches = await MatchModel.find({ tournament: tournamentId })
      return matches
    })
  }
}

export default MatchController
