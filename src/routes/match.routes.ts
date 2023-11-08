import { Router } from "express"
import { IRouter } from "../interface"

class MatchRoutes implements IRouter {
  readonly path: string = "/match"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {}
}

export default MatchRoutes
