import { Request, Response, Router } from "express"
import { IPrize, IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { PrizeController } from "../controllers"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ERole } from "../enum"

class PrizeRoutes implements IRouter {
  readonly path: string = "/prize"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    BRANCH: `${this.path}/branch/:branch`
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(this.PATHS.ROOT, PrizeRoutes.getAll)
    this.router.get(this.PATHS.ID, PrizeRoutes.getById)
    this.router.get(this.PATHS.BRANCH, PrizeRoutes.getBranchPrizes)
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<IPrize>("branch", "name", "value"),
      PrizeRoutes.create
    )
    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.doNotAllowFields<IPrize>("branch"),
      PrizeRoutes.update
    )
    this.router.delete(this.PATHS.ID, AuthMiddleware.verifyRoles([ERole.OWNER]), PrizeRoutes.delete)
  }

  static async getAll(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await PrizeController.getAll()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách giải thưởng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async getById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await PrizeController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin giải thưởng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async create(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await PrizeController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo giải thưởng thành công!", HttpStatusCode.CREATED, { data })
    })
  }

  static async update(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await PrizeController.update(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật giải thưởng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async delete(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await PrizeController.delete(req.params.id)
      return ResponseHelper.successfulResponse(res, "Xóa giải thưởng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getBranchPrizes(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await PrizeController.getBranchPrizes(req.params.branch)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách giải thưởng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }
}

export default PrizeRoutes
