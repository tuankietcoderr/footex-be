import { Schema, model } from "mongoose"
import IReport from "../interface/report.interface"
import { SCHEMA } from "./schema-name"
import { EReportStatus } from "../enum"

const ReportModel = new Schema<IReport>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.GUESTS
    },
    reported: {
      type: Schema.Types.ObjectId,
      refPath: "refPath"
    },
    refPath: {
      type: String,
      enum: [SCHEMA.TEAMS, SCHEMA.BRANCHES]
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(EReportStatus),
      default: EReportStatus.PENDING
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<IReport>(SCHEMA.REPORTS, ReportModel, SCHEMA.REPORTS)
