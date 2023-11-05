import "express"
import { ERole } from "../enum"

declare module "express" {
  export interface Request {
    user_id: string
    role: ERole
  }
}
