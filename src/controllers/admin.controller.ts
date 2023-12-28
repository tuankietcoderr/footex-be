import { Types } from "mongoose"
import { EBranchStatus, EFieldStatus, EGuestStatus, EOwnerStatus, EReportStatus, ERole, ETeamStatus } from "../enum"
import OwnerController from "./owner.controller"
import BaseController from "./base.controller"
import TeamController from "./team.controller"
import BranchController from "./branch.controller"
import FieldController from "./field.controller"
import GuestController from "./guest.controller"
import CredentialController from "./credential.controller"
import ReportController from "./report.controller"
import MailController from "./mail.controller"
import { IGuest, IOwner } from "../interface"

class AdminController extends BaseController {
  constructor() {
    super()
  }

  static async login(secretKey: string) {
    return await super.handleResponse(async () => {
      if (process.env.ADMIN_SECRET_KEY !== secretKey) return Promise.reject(new Error("Sai secret key"))
      const accessToken = CredentialController.JWTSign({ role: ERole.ADMIN, userId: "admin" })
      return { accessToken }
    })
  }

  static async getAllOwner() {
    return await super.handleResponse(async () => {
      return await OwnerController.getAll()
    })
  }

  static async getAllField() {
    return await super.handleResponse(async () => {
      return await FieldController.normalGetAll()
    })
  }

  static async getAllBranch() {
    return await super.handleResponse(async () => {
      return await BranchController.normalGetAll()
    })
  }

  static async getAllTeam() {
    return await super.handleResponse(async () => {
      return await TeamController.normalGetAll()
    })
  }

  static async getAllGuest() {
    return await super.handleResponse(async () => {
      return await GuestController.normalGetAll()
    })
  }

  static async getAllReport() {
    return await super.handleResponse(async () => {
      return await ReportController.getAll()
    })
  }

  static async updateReportStatus(id: string | Types.ObjectId, status: EReportStatus) {
    return await super.handleResponse(async () => {
      await ReportController.updateStatus(id, status)
    })
  }

  static async updateOwnerStatus(_id: string | Types.ObjectId, status: EOwnerStatus) {
    return await super.handleResponse(async () => {
      const {
        data: { email }
      } = await OwnerController.updateStatus(_id, status)
      await MailController.sendObjectStatusEmail(email, "Chủ sân", status)
    })
  }

  static async updateGuestStatus(_id: string | Types.ObjectId, status: EGuestStatus) {
    return await super.handleResponse(async () => {
      const {
        data: { email }
      } = await GuestController.updateStatus(_id, status)
      await MailController.sendObjectStatusEmail(email, "Khách hàng", status)
    })
  }

  static async updateBranchStatus(id: string | Types.ObjectId, status: EBranchStatus) {
    return await super.handleResponse(async () => {
      const { data } = await BranchController.updateStatus(id, status)
      const owner = (await data.populate("owner")) as IOwner
      await MailController.sendObjectStatusEmail(owner.email, "Chi nhánh", status)
    })
  }

  static async updateTeamStatus(id: string | Types.ObjectId, status: ETeamStatus) {
    return await super.handleResponse(async () => {
      const { data } = await TeamController.updateStatus(id, status)
      const captain = (await data.populate("captain")) as IGuest
      await MailController.sendObjectStatusEmail(captain.email, "Đội bóng", status)
    })
  }

  static async updateFieldStatus(id: string | Types.ObjectId, status: EFieldStatus) {
    return await super.handleResponse(async () => {
      await FieldController.updateStatus(id, status)
    })
  }
}

export default AdminController
