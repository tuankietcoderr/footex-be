import { Types } from "mongoose"
import { ETournamentStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { ITournament } from "../interface"
import { TeamModel, TournamentModel } from "../models"
import BaseController from "./base.controller"
import BranchController from "./branch.controller"
import TeamController from "./team.controller"

class TournamentController extends BaseController {
  constructor() {
    super()
  }

  static async preFind() {
    return await super.handleResponse(async () => {
      const tournaments = await TournamentModel.find()
      for (const tournament of tournaments) {
        const { _id, startAt, endAt } = tournament
        const now = new Date()
        if (now > new Date(startAt) && now < new Date(endAt)) {
          await tournament.updateOne({ $set: { status: ETournamentStatus.ONGOING } })
        }
        if (now > new Date(endAt)) {
          await tournament.updateOne({ $set: { status: ETournamentStatus.FINISHED } })
        }
      }
    })
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      return tournament
    })
  }

  static async create(body: ITournament) {
    return await super.handleResponse(async () => {
      const { branch, startAt, endAt } = body
      if (startAt > endAt)
        return Promise.reject(
          new CustomError("Ngày bắt đầu không được lớn hơn ngày kết thúc", HttpStatusCode.BAD_REQUEST)
        )
      if (new Date(startAt).getTime() < new Date().getTime()) {
        return Promise.reject(
          new CustomError("Ngày bắt đầu không được nhỏ hơn ngày hiện tại", HttpStatusCode.BAD_REQUEST)
        )
      }
      await BranchController.validate(branch as string)
      const existingTournaments = await TournamentModel.find({
        branch,
        $or: [
          {
            startAt: { $gt: startAt },
            endAt: { $lt: endAt }
          },
          { startAt: { $lt: endAt }, endAt: { $gt: startAt } }
        ]
      })

      if (existingTournaments.length > 0) {
        return Promise.reject(
          new CustomError("Đã có giải đấu được tạo trong khoảng thời gian này", HttpStatusCode.BAD_REQUEST)
        )
      }
      const tournament = await TournamentModel.create(body)
      const tournamentPopulated = await tournament.populate("prize", "-description -branch")
      return tournamentPopulated
    })
  }

  static async joinTournament(id: string | Types.ObjectId, teamId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const { data: team } = await TeamController.getById(teamId)
      if (team.jointTournaments.find((item) => item.toString() === id.toString()))
        return Promise.reject(new CustomError("Đội bóng đã tham gia giải đấu", HttpStatusCode.BAD_REQUEST))
      await team.updateOne({ $push: { jointTournaments: id } })
      const jointTournament = await tournament.updateOne({ $push: { teams: team } })
      return jointTournament
    })
  }

  static async removeTeam(id: string | Types.ObjectId, team: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const isExist = tournament.teams.find((item) => item.toString() === team.toString())
      if (!isExist) return Promise.reject(new CustomError("Đội bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      const newTournament = await tournament.updateOne({ $pull: { teams: team } })
      return newTournament
    })
  }

  static async updateInfo(id: string | Types.ObjectId, body: ITournament) {
    return await super.handleResponse(async () => {
      const { branch } = body
      await BranchController.validate(branch as string)
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const newTournament = await tournament.updateOne({ $set: body })
      return newTournament
    })
  }

  static async addToTimeline(id: string | Types.ObjectId, matchId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const { data: tournament } = await this.validate(id)
      const isExist = tournament.timelines.find((item) => item.toString() === matchId.toString())
      if (isExist) return Promise.reject(new CustomError("Trận đấu đã tồn tại", HttpStatusCode.BAD_REQUEST))
      const newTournament = await tournament.updateOne({ $push: { timelines: matchId } })
      return newTournament
    })
  }

  static async getAll() {
    return await super.handleResponse(async () => {
      await this.preFind()
      const tournament = await TournamentModel.find()
      return tournament
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async getGuestJointTournament(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      console.log({ id })
      const tournaments = await TeamModel.find({
        $or: [{ members: { $elemMatch: { $eq: id } } }, { captain: id }]
      })
        .select("jointTournaments")
        .populate("jointTournaments", "_id name images startAt endAt branch")
      return tournaments
    })
  }

  static async getTournamentsOfBranch(branch_id: string | Types.ObjectId) {
    await this.preFind()
    return await super.handleResponse(async () => {
      const tournaments = await TournamentModel.find(
        { branch: branch_id },
        {
          description: 0,
          branch: 0,
          timelines: 0
        },
        {
          populate: {
            path: "prize",
            select: "-description -branch"
          }
        }
      )
      return tournaments
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findByIdAndDelete(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      return tournament
    })
  }
}

export default TournamentController
