import "jsonwebtoken"
import { ERole } from "../enum"

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user_id: string
    role: ERole
  }
}
