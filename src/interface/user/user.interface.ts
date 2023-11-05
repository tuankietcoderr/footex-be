import IAddress from "../address.interface"

export default interface IUser {
  password: string
  name: string
  email: string
  avatar: string
  phoneNumber: string
  isEmailVerified: boolean
  address: IAddress
}
