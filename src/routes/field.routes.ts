import { Request, Response, Router } from "express"
import { IField, IRouter } from "../interface"
import { FieldController } from "../controllers"
import { CustomError, HttpStatusCode, ICustomError, ResponseHelper } from "../helper"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { EFieldStatus, ERole } from "../enum"

class FieldRoutes implements IRouter {
  readonly path: string = "/field"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    STATUS: `${this.path}/:id/status`,
    BRANCH: `${this.path}/branch/:id`
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
      AuthMiddleware.verifyRoles([ERole.ADMIN, ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<IField>("branch", "price", "name"),
      FieldRoutes.createField
    )
    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.ADMIN, ERole.OWNER]),
      BodyFieldMiddleware.doNotAllowFields<IField>("status"),
      FieldRoutes.updateField
    )
    this.router.put(
      this.PATHS.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN, ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<IField>("status"),
      FieldRoutes.updateFieldStatus
    )
  }

  static async getAllFields(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getAllFields()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getFieldById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getFieldById(req.params.id)
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
      const { data } = await FieldController.updateFieldInfo(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }
  static async updateFieldStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.updateFieldStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái sân bóng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }
}

export default FieldRoutes
