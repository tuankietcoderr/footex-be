import { Request, Response, Router } from "express"
import { ICardFine, IGoalDetail, IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { MatchController } from "../controllers"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ERole } from "../enum"

class MatchRoutes implements IRouter {
  readonly path: string = "/match"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    GOAL: `${this.path}/:id/goal`,
    GOAL_ID: `${this.path}/:id/goal/:goalId`,
    FINE: `${this.path}/:id/fine`,
    FINE_ID: `${this.path}/:id/fine/:fineId`,
    FINE_ID_CARD: `${this.path}/:id/fine/:fineId/card`
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(this.PATHS.ROOT, AuthMiddleware.verifyRoles([ERole.OWNER]), MatchRoutes.createMatch)
    this.router.get(this.PATHS.ID, MatchRoutes.getMatchById)
    this.router.put(
      this.PATHS.GOAL,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<IGoalDetail>("scoreAtMinute", "scoreBy", "team"),
      MatchRoutes.addGoal
    )
    this.router.delete(this.PATHS.GOAL_ID, AuthMiddleware.verifyRoles([ERole.OWNER]), MatchRoutes.deleteGoal)
    this.router.put(
      this.PATHS.FINE,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields<ICardFine>("cards", "player"),
      MatchRoutes.addCardFine
    )
    this.router.put(
      this.PATHS.FINE_ID_CARD,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields("card"),
      MatchRoutes.updateCardFine
    )
    this.router.delete(
      this.PATHS.FINE_ID_CARD,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      BodyFieldMiddleware.mustHaveFields("card"),
      MatchRoutes.deleteCardFine
    )
    this.router.delete(this.PATHS.FINE_ID, AuthMiddleware.verifyRoles([ERole.OWNER]), MatchRoutes.deleteFine)
  }

  private static async createMatch(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo trận đấu thành công!", HttpStatusCode.CREATED, { data })
    })
  }

  private static async getMatchById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin trận đấu thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async addGoal(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.createGoal(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Thêm bàn thắng thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async deleteGoal(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.deleteGoal(req.params.id, req.params.goalId)
      return ResponseHelper.successfulResponse(res, "Xóa bàn thắng thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async addCardFine(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.createFine(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Thêm thẻ phạt thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async updateCardFine(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.addFineForPlayer(req.params.fineId, req.body.card)
      return ResponseHelper.successfulResponse(res, "Cập nhật thẻ phạt thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async deleteCardFine(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.removeFineForPlayer(req.params.fineId, req.body.card)
      return ResponseHelper.successfulResponse(res, "Xóa thẻ phạt thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async deleteFine(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await MatchController.deleteFine(req.params.fineId)
      return ResponseHelper.successfulResponse(res, "Xóa thẻ phạt thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default MatchRoutes
