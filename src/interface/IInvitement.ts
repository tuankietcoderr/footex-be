import { Types } from 'mongoose'

export enum EInvitementStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export default interface IInvitement {
  title: string
  owner_title: string
  team_id: Types.ObjectId
  user_id: Types.ObjectId
  status: EInvitementStatus
}
