import { Request, Response, Router } from "express"
import { IInvitement, IRouter } from "../interface"
import { InvitementController } from "../controllers"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ERole } from "../enum"

class InvitementRoutes implements IRouter {
  readonly path: string = "/invitement"
  readonly router: Router = Router()
  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    STATUS: `${this.path}/:id/status`,
    GUEST: `${this.path}/guest`,
    TEAM: `${this.path}/team`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      this.PATHS.ROOT,
      BodyFieldMiddleware.mustHaveFields<IInvitement>("to", "team"),
      BodyFieldMiddleware.doNotAllowFields<IInvitement>("from", "status"),
      InvitementRoutes.invite
    )
    this.router.put(
      this.PATHS.STATUS,
      AuthMiddleware.verifyRoles([ERole.GUEST]),
      BodyFieldMiddleware.mustHaveFields<IInvitement>("status"),
      InvitementRoutes.updateInviteStatus
    )
    this.router.get(this.PATHS.GUEST, AuthMiddleware.verifyRoles([ERole.GUEST]), InvitementRoutes.getGuestInvitement)
    this.router.get(this.PATHS.TEAM, InvitementRoutes.getTeamInvitement)
    this.router.get(this.PATHS.ID, InvitementRoutes.getInvitementById)
    this.router.delete(this.PATHS.ID, InvitementRoutes.deleteInvitement)
  }

  static async invite(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvitementController.invite({ ...req.body, from: req.userId })
      return ResponseHelper.successfulResponse(res, "Mời thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async updateInviteStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvitementController.updateInviteStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getInvitementById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvitementController.getInvitementById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin lời mời thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getGuestInvitement(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvitementController.getGuestInvitement(req.userId)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách lời mời thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getTeamInvitement(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvitementController.getTeamInvitement(req.params.teamId)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách lời mời thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async deleteInvitement(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvitementController.deleteInvitement(req.params.id)
      return ResponseHelper.successfulResponse(res, "Xóa lời mời thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default InvitementRoutes
