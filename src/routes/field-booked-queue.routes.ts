import { Request, Response, Router } from "express"
import { IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { FieldBookedQueueController } from "../controllers"

class FieldBookedQueueRoutes implements IRouter {
  readonly path: string = "/field-booked-queue"
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
    this.router.post(this.PATHS.ROOT, FieldBookedQueueRoutes.createFieldBookedQueue)
  }

  static async createFieldBookedQueue(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await FieldBookedQueueController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo lịch đặt sân thành công!", HttpStatusCode.CREATED, { data })
    })
  }
}

export default FieldBookedQueueRoutes
