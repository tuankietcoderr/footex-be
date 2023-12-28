import { Request, Response, Router } from "express"
import { IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { InvoiceController } from "../controllers"

class InvoiceRoutes implements IRouter {
  readonly path: string = "/invoice"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    BRANCH: `${this.path}/branch/:branchId`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(this.PATHS.ROOT, InvoiceRoutes.getAll)
    this.router.get(this.PATHS.ID, InvoiceRoutes.getById)
    this.router.post(this.PATHS.ROOT, InvoiceRoutes.create)
    this.router.put(this.PATHS.ID, InvoiceRoutes.update)
    this.router.delete(this.PATHS.ID, InvoiceRoutes.delete)
    this.router.get(this.PATHS.BRANCH, InvoiceRoutes.getByBranchId)
  }

  static async getAll(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvoiceController.getAll()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách Invoice thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvoiceController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy Invoice thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async create(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvoiceController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo Invoice thành công!", HttpStatusCode.CREATED, { data })
    })
  }

  static async update(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvoiceController.update(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật Invoice thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async delete(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvoiceController.delete(req.params.id)
      return ResponseHelper.successfulResponse(res, "Xóa Invoice thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getByBranchId(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await InvoiceController.getBranchInvoices(req.params.branchId)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách Invoice thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default InvoiceRoutes
