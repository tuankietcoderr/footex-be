class BaseController {
  protected static async handleResponse<T>(cb: () => Promise<T>): Promise<{ data: T }> {
    try {
      const data = await cb()
      return Promise.resolve({ data })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default BaseController
