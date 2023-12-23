import { Types } from "mongoose"
import { CustomError, HttpStatusCode } from "../helper"
import { ICardFine, IGoalDetail, IMatch } from "../interface"
import { CardFineModel, GoalDetailModel, MatchModel, TournamentModel } from "../models"
import BaseController from "./base.controller"
import FieldController from "./field.controller"
import TeamController from "./team.controller"
import TournamentController from "./tournament.controller"
import { ECard } from "../enum"

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
    return await super.handleResponse(async () => {
      const match = await MatchModel.findById(
        matchId,
        {},
        {
          populate: [
            {
              path: "leftTeam",
              select: "name logo members",
              populate: {
                path: "members",
                select: "name avatar"
              }
            },
            {
              path: "rightTeam",
              select: "name logo members",
              populate: {
                path: "members",
                select: "name avatar"
              }
            },
            {
              path: "field",
              select: "name image"
            },
            {
              path: "leftTeamGoals",
              select: "scoreAtMinute scoreBy team",
              populate: [
                {
                  path: "scoreBy",
                  select: "name avatar"
                },
                {
                  path: "team",
                  select: "name logo"
                }
              ]
            },
            {
              path: "rightTeamGoals",
              select: "scoreAtMinute scoreBy team",
              populate: [
                {
                  path: "scoreBy",
                  select: "name avatar"
                },
                {
                  path: "team",
                  select: "name logo"
                }
              ]
            },
            {
              path: "fines",
              select: "cardType player",
              populate: {
                path: "player",
                select: "name avatar"
              }
            },
            {
              path: "fines",
              populate: {
                path: "player",
                select: "name avatar"
              }
            }
          ]
        }
      )
      if (!match) {
        return Promise.reject(new CustomError("Trận đấu không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      return match
    })
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

  static async getMatchesByTournament(tournamentId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      await TournamentController.validate(tournamentId)
      const matches = await MatchModel.find({ tournament: tournamentId })
      return matches
    })
  }

  static async createGoal(matchId: string, body: IGoalDetail) {
    return await super.handleResponse(async () => {
      const { scoreBy, scoreAtMinute, team } = body
      const match = await MatchModel.findById(matchId)
      if (!match) {
        return Promise.reject(new CustomError("Trận đấu không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      const newGoalDetail = await GoalDetailModel.create(body)
      const updated = await match.updateOne({
        $push: {
          [team === match.leftTeam.toString() ? "leftTeamGoals" : "rightTeamGoals"]: newGoalDetail._id
        }
      })
      return updated
    })
  }

  static async deleteGoal(matchId: string, goalId: string) {
    return await super.handleResponse(async () => {
      const match = await MatchModel.findById(matchId)
      if (!match) {
        return Promise.reject(new CustomError("Trận đấu không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      const goal = await GoalDetailModel.findById(goalId)
      if (!goal) {
        return Promise.reject(new CustomError("Bàn thắng không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      const updated = await match.updateOne({
        $pull: {
          [goal.team === match.leftTeam.toString() ? "leftTeamGoals" : "rightTeamGoals"]: goalId
        }
      })
      await goal.deleteOne()
      return updated
    })
  }

  static async createFine(matchId: string, body: ICardFine) {
    return await super.handleResponse(async () => {
      const match = await MatchModel.findById(matchId)
      if (!match) {
        return Promise.reject(new CustomError("Trận đấu không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      const existFine = await CardFineModel.findOne({ match: matchId, player: body.player })
      if (existFine) {
        return Promise.reject(new CustomError("Thẻ phạt đã tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      const newFine = await CardFineModel.create({ ...body, match: matchId })
      const updated = await match.updateOne({
        $push: {
          fines: newFine._id
        }
      })
      return updated
    })
  }

  static async addFineForPlayer(fineId: string, card: ECard) {
    return await super.handleResponse(async () => {
      const fine = await CardFineModel.findByIdAndUpdate(fineId, {
        $push: {
          cards: card
        }
      })
      if (!fine) {
        return Promise.reject(new CustomError("Thẻ phạt không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }

      return fine
    })
  }

  static async removeFineForPlayer(fineId: string, card: ECard) {
    return await super.handleResponse(async () => {
      const fine = await CardFineModel.findById(fineId)
      if (!fine) {
        return Promise.reject(new CustomError("Thẻ phạt không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }

      const cards = fine.cards
      const index = cards.indexOf(card)
      if (index === -1) {
        return Promise.reject(new CustomError("Thẻ phạt không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      fine.cards.splice(index, 1)
      await fine.save()

      return fine
    })
  }

  static async deleteFine(fineId: string) {
    return await super.handleResponse(async () => {
      const fine = await CardFineModel.findByIdAndDelete(fineId)
      if (!fine) {
        return Promise.reject(new CustomError("Thẻ phạt không tồn tại!", HttpStatusCode.BAD_REQUEST))
      }
      return fine
    })
  }
}

export default MatchController
