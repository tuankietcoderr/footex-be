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
    OWNER: `${this.path}/owner`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(this.PATHS.ROOT, BranchRoutes.getAllBranches)
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<IBranch>("name", "address", "openAt", "closeAt"),
      BodyFieldMiddleware.doNotAllowFields<IBranch>("status", "owner"),
      BranchRoutes.createBranch
    )

    this.router.get(this.PATHS.OWNER, AuthMiddleware.verifyRoles([ERole.OWNER]), BranchRoutes.getOwnerBranches)

    this.router.get(this.PATHS.ID, BranchRoutes.getBranchById)
    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.doNotAllowFields<IBranch>("status", "owner"),
      BranchRoutes.updateBranchInfo
    )
    this.router.delete(this.PATHS.ID, AuthMiddleware.verifyRoles([ERole.OWNER]), BranchRoutes.deleteBranch)
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
        owner: req.userId
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

  static async getOwnerBranches(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await BranchController.getOwnerBranches(req.userId)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async deleteBranch(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await BranchController.delete(req.params.id)
      return ResponseHelper.successfulResponse(res, "Xóa sân bóng thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default BranchRoutes
