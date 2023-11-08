import "express"
import { ERole } from "../enum"

declare module "express" {
  export interface Request {
    userId: string
    role: ERole
  }
}
