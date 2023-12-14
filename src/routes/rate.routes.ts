import { Request, Response, Router } from "express"
import { IRate, IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { RateController } from "../controllers"
import { ERate } from "../enum"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"

class RateRoutes implements IRouter {
  readonly path: string = "/rate"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    OBJECT: `${this.path}/:objectType/:objectId`
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles(),
      BodyFieldMiddleware.doNotAllowFields<IRate>("valuer"),
      BodyFieldMiddleware.mustHaveFields<IRate>("object", "refPath", "rateValue", "description"),
      RateRoutes.createRate
    )
    this.router.get(this.PATHS.OBJECT, RateRoutes.getObjectRates)
  }

  static async createRate(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await RateController.create({
        ...req.body,
        valuer: req.userId
      })
      return ResponseHelper.successfulResponse(res, "Đánh giá thành công!", HttpStatusCode.CREATED, { data })
    })
  }

  static async getObjectRates(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await RateController.getObjectRates(req.params.objectType as ERate, req.params.objectId)
      return ResponseHelper.successfulResponse(res, "Lấy đánh giá thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default RateRoutes
