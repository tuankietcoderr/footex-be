import { Router } from "express"
import { IRouter } from "../interface"

class CardFineRoutes implements IRouter {
  readonly path: string = "/card-fine"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {}
}

export default CardFineRoutes
