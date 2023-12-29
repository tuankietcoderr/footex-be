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
    ROOT: this.path,
    LOGIN: `${this.path}/login`,
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
    },
    MANAGE_REPORT: {
      ROOT: `${this.path}/report`,
      REPORT: `${this.path}/report/:reportId`,
      STATUS: `${this.path}/report/:reportId/status`
    }
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(this.PATHS.LOGIN, BodyFieldMiddleware.mustHaveFields("secretKey"), this.login)
    this.router.put(
      this.PATHS.MANAGE_OWNER.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateOwnerStatus
    )
    this.router.put(
      this.PATHS.MANAGE_GUEST.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateGuestStatus
    )
    this.router.put(
      this.PATHS.MANAGE_FIELD.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateFieldStatus
    )
    this.router.put(
      this.PATHS.MANAGE_TEAM.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateTeamStatus
    )
    this.router.put(
      this.PATHS.MANAGE_BRANCH.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateBranchStatus
    )
    this.router.put(
      this.PATHS.MANAGE_REPORT.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN]),
      BodyFieldMiddleware.mustHaveFields("status"),
      this.updateReportStatus
    )

    this.router.get(this.PATHS.MANAGE_OWNER.ROOT, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.getAllOwner)
    this.router.get(this.PATHS.MANAGE_FIELD.ROOT, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.getAllField)
    this.router.get(this.PATHS.MANAGE_BRANCH.ROOT, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.getAllBranch)
    this.router.get(this.PATHS.MANAGE_TEAM.ROOT, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.getAllTeam)
    this.router.get(this.PATHS.MANAGE_GUEST.ROOT, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.getAllGuest)
    this.router.get(this.PATHS.MANAGE_REPORT.ROOT, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.getAllReport)

    this.router.delete(this.PATHS.MANAGE_REPORT.REPORT, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.deleteReport)
  }

  private async login(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { secretKey } = req.body
      const { data } = await AdminController.login(secretKey)
      return ResponseHelper.successfulResponse(res, "Đăng nhập thành công!", HttpStatusCode.OK, data)
    })
  }

  private async getAllOwner(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await AdminController.getAllOwner()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách chủ nhà thành công!", HttpStatusCode.OK, data)
    })
  }

  private async getAllField(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await AdminController.getAllField()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách sân thành công!", HttpStatusCode.OK, data)
    })
  }

  private async getAllBranch(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await AdminController.getAllBranch()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách chi nhánh thành công!", HttpStatusCode.OK, data)
    })
  }

  private async getAllTeam(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await AdminController.getAllTeam()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách đội thành công!", HttpStatusCode.OK, data)
    })
  }

  private async getAllGuest(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await AdminController.getAllGuest()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách khách hàng thành công!", HttpStatusCode.OK, data)
    })
  }

  private async getAllReport(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await AdminController.getAllReport()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách báo cáo thành công!", HttpStatusCode.OK, data)
    })
  }

  private async updateReportStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateReportStatus(req.params.reportId, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateOwnerStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateOwnerStatus(req.params.ownerId, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateGuestStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateGuestStatus(req.params.guestId, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateFieldStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateFieldStatus(req.params.fieldId, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateBranchStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateBranchStatus(req.params.branchId, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async updateTeamStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.updateTeamStatus(req.params.teamId, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái thành công!", HttpStatusCode.OK)
    })
  }

  private async deleteReport(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.deleteReport(req.params.reportId)
      return ResponseHelper.successfulResponse(res, "Xóa báo cáo thành công!", HttpStatusCode.OK)
    })
  }
}

export default AdminRoutes
