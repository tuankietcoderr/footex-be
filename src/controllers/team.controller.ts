import { Types } from "mongoose"
import { ITeam } from "../interface"
import { TeamModel } from "../models"
import BaseController from "./base.controller"
import { CustomError, HttpStatusCode } from "../helper"

class TeamController extends BaseController {
  constructor() {
    super()
  }

  static async validateTeam(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findById(id)
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }

  static async getTeamById(id: string | Types.ObjectId) {
    return await this.validateTeam(id)
  }

  static async create(body: ITeam) {
    return await super.handleResponse(async () => {
      const { captain } = body
      const newTeam = await TeamModel.create(body)
      return newTeam
    })
  }

  static async leaveTeam(id: string | Types.ObjectId, member: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const { data: team } = await this.getTeamById(id)
      const leftTeam = await team.updateOne({ $pull: { members: member } })
      return leftTeam
    })
  }
}

export default TeamController
