import { Request, Response, Router } from "express"
import { FieldController } from "../controllers"
import { ERole } from "../enum"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { IField, IRouter } from "../interface"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"

class FieldRoutes implements IRouter {
  readonly path: string = "/field"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    BRANCH: `${this.path}/branch/:id`,
    STATUS: `${this.path}/:id/status`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(this.PATHS.ROOT, FieldRoutes.getAllFields)
    this.router.get(this.PATHS.ID, FieldRoutes.getFieldById)
    this.router.get(this.PATHS.BRANCH, FieldRoutes.getBranchsField)
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<IField>("branch", "price", "name", "description"),
      FieldRoutes.createField
    )
    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.doNotAllowFields<IField>("status"),
      FieldRoutes.updateField
    )
    this.router.put(this.PATHS.STATUS, AuthMiddleware.verifyRoles([ERole.OWNER]), FieldRoutes.updateStatus)
  }

  static async getAllFields(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getAll()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getFieldById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getBranchsField(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getBranchsField(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async createField(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }
  static async updateField(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.updateInfo(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async updateStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.updateStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái sân bóng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }
}

export default FieldRoutes
