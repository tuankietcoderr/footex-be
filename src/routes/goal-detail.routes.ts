import { Router } from "express"
import { IRouter } from "../interface"

class GoalDetailRoutes implements IRouter {
  readonly path: string = "/goal-detail"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {}
}

export default GoalDetailRoutes
