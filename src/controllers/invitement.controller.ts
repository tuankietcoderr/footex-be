import { Types } from "mongoose"
import { CustomError, HttpStatusCode } from "../helper"
import { IInvitement } from "../interface"
import { InvitementModel } from "../models"
import BaseController from "./base.controller"
import { EInvitementStatus } from "../enum"

class InvitementController extends BaseController {
  constructor() {
    super()
  }

  static async validateInvitement(id: string | Types.ObjectId) {
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

  static async updateInviteStatus(id: string | Types.ObjectId, status: EInvitementStatus) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
      )
      if (!invitement) return Promise.reject(new CustomError("Lời mời không tồn tại", HttpStatusCode.BAD_REQUEST))
      return invitement
    })
  }

  static async getInvitementById(id: string | Types.ObjectId) {
    return await this.validateInvitement(id)
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

  static async deleteInvitement(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invitement = await InvitementModel.findByIdAndDelete(id)
      if (!invitement) return Promise.reject(new CustomError("Lời mời không tồn tại", HttpStatusCode.BAD_REQUEST))
      return invitement
    })
  }
}

export default InvitementController
