import { Router } from "express"
import { IRouter } from "../interface"

class MatchResultDetailRoutes implements IRouter {
  readonly path: string = "/match-result-detail"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {}
}

export default MatchResultDetailRoutes
