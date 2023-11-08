import { Types } from "mongoose"
import BaseController from "./base.controller"
import { TeamModel, TournamentModel } from "../models"
import { CustomError, HttpStatusCode } from "../helper"
import { ITournament } from "../interface"
import BranchController from "./branch.controller"
import { SCHEMA } from "../models/schema-name"
import GuestController from "./guest.controller"
import TeamController from "./team.controller"
import MatchController from "./match.controller"

class TournamentController extends BaseController {
  constructor() {
    super()
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
      const tournament = await TournamentModel.create(body)
      return tournament
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
}

export default TournamentController
