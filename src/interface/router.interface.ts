import { Router } from "express"

export default interface IRouter {
  readonly path: string
  readonly router: Router
}
