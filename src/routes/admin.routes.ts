import { Request, Response, Router } from "express"
import { IRouter } from "../interface"
import { HttpStatusCode, ICustomError, ResponseHelper } from "../helper"
import { EGuestStatus, EOwnerStatus, ERole } from "../enum"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { AdminController } from "../controllers"

class AdminRoutes implements IRouter {
  readonly path: string = "/admin"
  readonly router: Router = Router()

  private readonly PATHS = {
    MANAGE_OWNER: {
      ROOT: `${this.path}/owner`,
      STATUS: `${this.path}/owner/:ownerId/status`,
      OWNER: `${this.path}/owner/:ownerId`,
      OWNER_TOURNAMENTS: `${this.path}/owner/:ownerId/tournaments`
    },
    MANAGE_GUEST: {
      ROOT: `${this.path}/guest`,
      STATUS: `${this.path}/guest/:guestId/status`,
      GUEST: `${this.path}/guest/:guestId`,
      GUEST_TOURNAMENTS: `${this.path}/guest/:guestId/tournaments`
    },
    MANAGE_FIELD: {
      ROOT: `${this.path}/field`,
      FIELD: `${this.path}/field/:fieldId`,
      STATUS: `${this.path}/field/:fieldId/status`
    },
    MANAGE_TEAM: {
      ROOT: `${this.path}/team`,
      TEAM: `${this.path}/team/:teamId`,
      STATUS: `${this.path}/team/:teamId/status`
    },
    MANAGE_BRANCH: {
      ROOT: `${this.path}/branch`,
      BRANCH: `${this.path}/branch/:branchId`,
      STATUS: `${this.path}/branch/:branchId/status`
    }
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.put(
      this.PATHS.MANAGE_OWNER.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateOwnerStatus
    )
    this.router.put(
      this.PATHS.MANAGE_GUEST.GUEST,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateGuestStatus
    )
    this.router.put(
      this.PATHS.MANAGE_FIELD.FIELD,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateFieldStatus
    )
    this.router.put(
      this.PATHS.MANAGE_TEAM.TEAM,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateTeamStatus
    )
    this.router.put(
      this.PATHS.MANAGE_BRANCH.BRANCH,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateBranchStatus
    )
  }

  private async updateOwnerStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateOwnerStatus(req.params.ownerId, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateGuestStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateGuestStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateFieldStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateFieldStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateBranchStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateBranchStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateTeamStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateTeamStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }
}

export default AdminRoutes
