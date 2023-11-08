import { Types } from "mongoose"
import { EBranchStatus, EFieldStatus, EGuestStatus, EOwnerStatus, ETeamStatus } from "../enum"
import OwnerController from "./owner.controller"
import BaseController from "./base.controller"
import TeamController from "./team.controller"
import BranchController from "./branch.controller"
import FieldController from "./field.controller"
import GuestController from "./guest.controller"

class AdminController extends BaseController {
  constructor() {
    super()
  }

  static async updateOwnerStatus(_id: string | Types.ObjectId, status: EOwnerStatus) {
    return await super.handleResponse(async () => {
      await OwnerController.updateStatus(_id, status)
    })
  }

  static async updateGuestStatus(_id: string | Types.ObjectId, status: EGuestStatus) {
    return await super.handleResponse(async () => {
      await GuestController.updateStatus(_id, status)
    })
  }

  static async updateBranchStatus(id: string | Types.ObjectId, status: EBranchStatus) {
    return await super.handleResponse(async () => {
      await BranchController.updateStatus(id, status)
    })
  }

  static async updateTeamStatus(id: string | Types.ObjectId, status: ETeamStatus) {
    return await super.handleResponse(async () => {
      await TeamController.updateStatus(id, status)
    })
  }

  static async updateFieldStatus(id: string | Types.ObjectId, status: EFieldStatus) {
    return await super.handleResponse(async () => {
      await FieldController.updateStatus(id, status)
    })
  }
}

export default AdminController
