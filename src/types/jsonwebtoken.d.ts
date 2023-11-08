import "jsonwebtoken"
import { ERole } from "../enum"

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string
    role: ERole
  }
}
