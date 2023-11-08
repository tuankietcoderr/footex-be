import { Types } from "mongoose"
import { ITeam } from "../interface"
import { TeamModel } from "../models"
import BaseController from "./base.controller"
import { CustomError, HttpStatusCode } from "../helper"
import { ETeamStatus } from "../enum"

class TeamController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findById(id)
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }

  static async getAll() {
    return await super.handleResponse(async () => {
      const teams = await TeamModel.find()
      return teams
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async create(body: ITeam) {
    return await super.handleResponse(async () => {
      const newTeam = await TeamModel.create(body)
      return newTeam
    })
  }

  static async updateInfo(id: string | Types.ObjectId, body: ITeam) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }

  static async updateStatus(id: string | Types.ObjectId, status: ETeamStatus) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true })
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }

  static async leave(id: string | Types.ObjectId, member: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const { data: team } = await this.getById(id)
      const leftTeam = await team.updateOne({ $pull: { members: member } })
      return leftTeam
    })
  }

  static async getGuestJointTeams(guestId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const teams = await TeamModel.find({
        members: { $elemMatch: { $eq: guestId } }
      })
      return teams
    })
  }

  static async getCaptainTeams(guestId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const teams = await TeamModel.find({ captain: guestId })
      return teams
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findByIdAndUpdate(id, { $set: { status: ETeamStatus.DELETED } })
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }
}

export default TeamController
