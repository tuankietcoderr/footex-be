export interface ICustomError {
  statusCode: number
  message: string
}

class CustomError implements ICustomError {
  statusCode: number
  message: string
  constructor(message: string, statusCode: number) {
    this.message = message
    this.statusCode = statusCode
  }
}

export default CustomError
