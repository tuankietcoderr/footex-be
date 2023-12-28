import { Types } from "mongoose"
import BaseController from "./base.controller"
import { CustomError, HttpStatusCode } from "../helper"
import { ReportModel } from "../models"
import IReport from "../interface/report.interface"
import { EReportStatus } from "../enum"

class ReportController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const report = await ReportModel.findById(id)
      if (!report) return Promise.reject(new CustomError("Report không tồn tại", HttpStatusCode.BAD_REQUEST))
      return report
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async getAll() {
    return await super.handleResponse(async () => {
      const reports = await ReportModel.find(
        {},
        {},
        {
          populate: [
            {
              path: "reporter",
              select: "name"
            },
            {
              path: "reported",
              select: "name"
            }
          ]
        }
      )
      return reports
    })
  }

  static async create(body: IReport) {
    return await super.handleResponse(async () => {
      const newReport = await ReportModel.create(body)
      return newReport
    })
  }

  static async updateStatus(id: string | Types.ObjectId, status: EReportStatus) {
    return await super.handleResponse(async () => {
      const report = await ReportModel.findByIdAndUpdate(id, { $set: { status } }, { new: true })
      if (!report) return Promise.reject(new CustomError("Report không tồn tại", HttpStatusCode.BAD_REQUEST))
      return report
    })
  }
}

export default ReportController
