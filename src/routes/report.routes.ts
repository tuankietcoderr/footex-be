import { Request, Response, Router } from "express"
import { IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { ReportController } from "../controllers"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ERole } from "../enum"
import IReport from "../interface/report.interface"

class ReportRoutes implements IRouter {
  readonly path: string = "/report"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(this.PATHS.ROOT, AuthMiddleware.verifyRoles([ERole.GUEST]), ReportRoutes.getAllReports)
    this.router.get(this.PATHS.ID, AuthMiddleware.verifyRoles([ERole.GUEST]), ReportRoutes.getReportById)
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles([ERole.GUEST]),
      BodyFieldMiddleware.doNotAllowFields<IReport>("reporter", "status"),
      BodyFieldMiddleware.mustHaveFields<IReport>("reason", "title", "refPath", "reported"),
      ReportRoutes.createReport
    )
  }

  private static async getAllReports(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await ReportController.getAll()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách report thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async getReportById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await ReportController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin report thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async createReport(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await ReportController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo report thành công!", HttpStatusCode.CREATED, { data })
    })
  }
}

export default ReportRoutes
