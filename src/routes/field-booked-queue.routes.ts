import { Request, Response, Router } from "express"
import { IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { FieldBookedQueueController } from "../controllers"
import { AuthMiddleware } from "../middleware"
import { ERole } from "../enum"

class FieldBookedQueueRoutes implements IRouter {
  readonly path: string = "/field-booked-queue"
  readonly router: Router = Router()
  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    STATUS: `${this.path}/:id/status`,
    FIELD: `${this.path}/field/:id`,
    GUEST: `${this.path}/guest/:id`
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles([ERole.OWNER, ERole.GUEST]),
      FieldBookedQueueRoutes.createFieldBookedQueue
    )
    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      FieldBookedQueueRoutes.updateFieldBookedQueueInfo
    )
    this.router.get(
      this.PATHS.GUEST,
      AuthMiddleware.verifyRoles([ERole.OWNER, ERole.GUEST]),
      FieldBookedQueueRoutes.getGuestFieldBookedQueue
    )
    this.router.get(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      FieldBookedQueueRoutes.getFieldBookedQueueById
    )
    this.router.get(
      this.PATHS.FIELD,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      FieldBookedQueueRoutes.getFieldBookedQueueByField
    )
    this.router.put(
      this.PATHS.STATUS,
      AuthMiddleware.verifyRoles([ERole.OWNER, ERole.GUEST]),
      FieldBookedQueueRoutes.updateFieldBookedQueueStatus
    )
    this.router.delete(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      FieldBookedQueueRoutes.deleteFieldBookedQueue
    )
  }

  static async createFieldBookedQueue(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo lịch đặt sân thành công!", HttpStatusCode.CREATED, { data })
    })
  }

  static async updateFieldBookedQueueInfo(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.updateInfo(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật thông tin lịch đặt sân thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async getGuestFieldBookedQueue(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.getGuestFieldBookedQueue(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách lịch đặt sân thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async getFieldBookedQueueById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin lịch đặt sân thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async getFieldBookedQueueByField(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.getByFieldId(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách lịch đặt sân thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async updateFieldBookedQueueStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.updateStatus(req.params.id, req.body.status)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái lịch đặt sân thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async deleteFieldBookedQueue(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.delete(req.params.id)
      return ResponseHelper.successfulResponse(res, "Xóa lịch đặt sân thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default FieldBookedQueueRoutes
