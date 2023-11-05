import { Request, Response, Router } from "express"
import { IBranch, IRouter } from "../interface"
import { BranchController } from "../controllers"
import { EBranchStatus, ERole } from "../enum"
import { HttpStatusCode, ICustomError, ResponseHelper } from "../helper"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"

class BranchRoutes implements IRouter {
  readonly path: string = "/branch"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    STATUS: `${this.path}/:id/status`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(this.PATHS.ROOT, BranchRoutes.getAllBranches)
    this.router.get(this.PATHS.ID, BranchRoutes.getBranchById)
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles([ERole.ADMIN, ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<IBranch>("name", "address", "openAt", "closeAt"),
      BodyFieldMiddleware.doNotAllowFields<IBranch>("status", "owner"),
      BranchRoutes.createBranch
    )

    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.ADMIN, ERole.OWNER]),
      BodyFieldMiddleware.doNotAllowFields<IBranch>("status", "owner"),
      BranchRoutes.updateBranchInfo
    )

    this.router.put(
      this.PATHS.STATUS,
      AuthMiddleware.verifyRoles([ERole.ADMIN, ERole.OWNER]),
      BranchRoutes.updateBranchStatus
    )
  }

  static async getAllBranches(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await BranchController.getAllBranches()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getBranchById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await BranchController.getBranchById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async createBranch(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await BranchController.create({
        ...req.body,
        owner: req.user_id
      })
      return ResponseHelper.successfulResponse(res, "Tạo sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async updateBranchInfo(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await BranchController.updateInfo(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật thông tin sân bóng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async updateBranchStatus(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await BranchController.updateStatus(req.params.id, req.body.status as EBranchStatus)
      return ResponseHelper.successfulResponse(res, "Cập nhật trạng thái sân bóng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }
}

export default BranchRoutes
