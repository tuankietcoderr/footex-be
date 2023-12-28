import { Request, Response, Router } from "express"
import { FieldController } from "../controllers"
import { ERole } from "../enum"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { IAddress, IField, IRouter } from "../interface"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"

class FieldRoutes implements IRouter {
  readonly path: string = "/field"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    BRANCH: `${this.path}/branch/:id`,
    NEAR_BY: `${this.path}/near-by/branch/:id`,
    STATUS: `${this.path}/:id/status`,
    SAVE: `${this.path}/save`,
    SAVED: `${this.path}/saved/:userId`,
    BOOKED: `${this.path}/booked/:userId`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(this.PATHS.ROOT, FieldRoutes.getAllFields)
    this.router.get(this.PATHS.BRANCH, FieldRoutes.getBranchsField)
    this.router.get(this.PATHS.NEAR_BY, FieldRoutes.getNearByFields)
    this.router.get(this.PATHS.SAVED, FieldRoutes.getSavedFields)
    this.router.get(this.PATHS.BOOKED, FieldRoutes.getBookedFields)
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
    this.router.post(this.PATHS.SAVE, AuthMiddleware.verifyRoles([ERole.GUEST]), FieldRoutes.saveField)
    this.router.get(this.PATHS.ID, FieldRoutes.getFieldById)
  }

  static async getAllFields(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getAll(req.query)
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

  static async getNearByFields(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getFieldsNearBranchAddress(req.params.id, req.query as any as IAddress)
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

  static async saveField(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.saveField(req.body.fieldId, req.userId)
      return ResponseHelper.successfulResponse(res, "OK!", HttpStatusCode.OK, { data })
    })
  }

  static async getSavedFields(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getSavedFields(req.params.userId)
      return ResponseHelper.successfulResponse(res, "OK!", HttpStatusCode.OK, { data })
    })
  }

  static async getBookedFields(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldController.getBookedFields(req.params.userId)
      return ResponseHelper.successfulResponse(res, "OK!", HttpStatusCode.OK, { data })
    })
  }
}

export default FieldRoutes
