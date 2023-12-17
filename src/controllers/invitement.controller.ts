import { Types } from "mongoose"
import { CustomError, HttpStatusCode } from "../helper"
import { IInvitement } from "../interface"
import { InvitementModel, TeamModel } from "../models"
import BaseController from "./base.controller"
import { EInvitementStatus } from "../enum"
import TeamController from "./team.controller"

class InvitementController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.findById(id)
      if (!invitement) return Promise.reject(new CustomError("Lời mời không tồn tại", HttpStatusCode.BAD_REQUEST))
      return invitement
    })
  }

  static async invite(body: IInvitement) {
    return await super.handleResponse(async () => {
      const { from, to, team } = body
      const invitementExist = await InvitementModel.findOne({ $and: [{ from }, { to }, { team }] })
      if (invitementExist) return Promise.reject(new CustomError("Lời mời đã tồn tại", HttpStatusCode.BAD_REQUEST))
      const newInvitement = await InvitementModel.create(body)
      return newInvitement
    })
  }

  static async request(body: IInvitement) {
    return await super.handleResponse(async () => {
      const { from, team } = body
      const teamExist = await TeamModel.findById(team as string)
      if (!teamExist) return Promise.reject(new CustomError("Đội không tồn tại", HttpStatusCode.BAD_REQUEST))
      const requestExist = await InvitementModel.findOne({ $and: [{ from }, { to: teamExist.captain }, { team }] })
      if (requestExist)
        return Promise.reject(new CustomError("Yêu cầu tham gia đã tồn tại", HttpStatusCode.BAD_REQUEST))
      const newRequest = new InvitementModel({ ...body, to: teamExist.captain, isJoinRequest: true })
      await TeamModel.findByIdAndUpdate(team, { $push: { joinRequests: newRequest._id } })
      await newRequest.save()
      return newRequest
    })
  }

  static async cancelRequest(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const request = await InvitementModel.findById(id)
      if (!request) return Promise.reject(new CustomError("Yêu cầu tham gia không tồn tại", HttpStatusCode.BAD_REQUEST))
      await TeamModel.findByIdAndUpdate(request.team, { $pull: { joinRequests: request._id } })
      const deletedRequest = await request.deleteOne()
      return deletedRequest
    })
  }

  static async updateInviteStatus(id: string | Types.ObjectId, status: EInvitementStatus) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.findById(id)
      if (!invitement) return Promise.reject(new CustomError("Lời mời không tồn tại", HttpStatusCode.BAD_REQUEST))

      if (status === EInvitementStatus.APPROVED) {
        const member = invitement.isJoinRequest ? invitement.from : invitement.to
        await TeamController.addMember(invitement.team as string, member as string)
        await TeamModel.findByIdAndUpdate(invitement.team, { $pull: { joinRequests: invitement._id } })
      }

      invitement.status = status
      await invitement.save()

      return invitement
    })
  }

  static async getInvitementById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async getGuestInvitement(guestId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.find({ to: guestId })
      return invitement
    })
  }

  static async getTeamInvitement(teamId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.find({ team: teamId })
      return invitement
    })
  }

  static async getTeamRequest(teamId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.find(
        { team: teamId, isJoinRequest: true },
        {},
        {
          populate: [
            {
              path: "from",
              select: "name avatar"
            },
            {
              path: "to",
              select: "name avatar"
            },
            {
              path: "team",
              select: "name logo"
            }
          ]
        }
      )
      return invitement
    })
  }

  static async deleteInvitement(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.findByIdAndDelete(id)
      if (!invitement) return Promise.reject(new CustomError("Lời mời không tồn tại", HttpStatusCode.BAD_REQUEST))
      return invitement
    })
  }
}

export default InvitementController
