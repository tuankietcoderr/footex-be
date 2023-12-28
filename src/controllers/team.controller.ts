import { Types } from "mongoose"
import { ITeam } from "../interface"
import { TeamModel } from "../models"
import BaseController from "./base.controller"
import { CustomError, HttpStatusCode } from "../helper"
import { ETeamStatus } from "../enum"
import { SCHEMA } from "../models/schema-name"

class TeamController extends BaseController {
  constructor() {
    super()
  }

  static async normalGetAll() {
    return await super.handleResponse(async () => {
      const teams = await TeamModel.find(
        {},
        {
          createdAt: 0,
          updatedAt: 0,
          images: 0,
          description: 0
        },
        {
          populate: [
            {
              path: "captain",
              select: "name"
            }
          ]
        }
      )
      return teams
    })
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findById(
        id,
        {},
        {
          populate: [
            {
              path: "captain",
              select: "district city ward houseNumber street name"
            },
            {
              path: "members",
              select: "district city ward houseNumber street name email phoneNumber"
            },
            {
              path: "jointTournaments",
              select: "name startAt endAt status",
              populate: [
                { path: "prize", select: "name image winners value" },
                {
                  path: "branch",
                  select: "district city ward houseNumber street"
                }
              ]
            },
            {
              path: "joinRequests",
              select: "from"
            }
          ]
        }
      )
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }

  static async getAll(queries?: any) {
    return await super.handleResponse(async () => {
      const { city, district, ward, keyword } = queries
      const queryKeys = Object.keys(queries)
      const keywordKeyIndex = queryKeys.indexOf("keyword")
      if (keywordKeyIndex !== -1) queryKeys.splice(keywordKeyIndex, 1)

      let teams = []

      if (keyword) {
        teams = await TeamModel.find(
          {
            name: { $regex: keyword, $options: "i" }
          },
          {
            createdAt: 0,
            updatedAt: 0,
            images: 0,
            description: 0
          },
          {
            populate: [
              {
                path: "captain",
                select: "district city ward houseNumber street"
              },
              {
                path: "joinRequests",
                select: "from"
              }
            ]
          }
        )
      } else {
        teams = await TeamModel.aggregate([
          {
            $lookup: {
              from: SCHEMA.GUESTS,
              localField: "captain",
              foreignField: "_id",
              as: "captain",
              pipeline: [
                {
                  $project: {
                    district: 1,
                    city: 1,
                    ward: 1,
                    houseNumber: 1,
                    street: 1
                  }
                }
              ]
            }
          },
          {
            $unwind: "$captain"
          },
          {
            $lookup: {
              from: SCHEMA.INVITEMENTS,
              localField: "joinRequests",
              foreignField: "_id",
              as: "joinRequests",
              pipeline: [
                {
                  $project: {
                    from: 1
                  }
                }
              ]
            }
          },
          {
            $match:
              queryKeys.length > 0
                ? {
                    $and: [
                      {
                        ...(city && {
                          "captain.city": { $eq: city }
                        })
                      },
                      {
                        ...(district && { "captain.district": { $eq: district } })
                      },
                      {
                        ...(ward && { "captain.ward": { $eq: ward } })
                      }
                    ]
                  }
                : {}
          },
          {
            //! TODO: project
            $project: {
              createdAt: 0,
              updatedAt: 0,
              images: 0,
              description: 0
            }
          }
        ])
      }
      return teams
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async create(body: ITeam) {
    return await super.handleResponse(async () => {
      const newTeam = await TeamModel.create(body)
      return newTeam
    })
  }

  static async updateInfo(id: string | Types.ObjectId, body: ITeam) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }

  static async updateStatus(id: string | Types.ObjectId, status: ETeamStatus) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true })
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }

  static async addMember(id: string | Types.ObjectId, member: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findById(id)
      if (!team) {
        return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      }

      for (const t of team.members) {
        if (t.toString() === member) {
          return Promise.reject(new CustomError("Thành viên đã ở trong đội bóng", HttpStatusCode.BAD_REQUEST))
        }
      }

      const res = await team.updateOne({ $push: { members: member } }, { new: true })
      return res
    })
  }

  static async kickMember(id: string | Types.ObjectId, member: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const res = await TeamModel.findByIdAndUpdate(id, { $pull: { members: member } }, { new: true })
      if (!res) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return res
    })
  }

  static async leave(id: string | Types.ObjectId, member: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const { data: team } = await this.getById(id)
      const leftTeam = await team.updateOne({ $pull: { members: member } })
      return leftTeam
    })
  }

  static async getGuestJointTeams(guestId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const teams = await TeamModel.find(
        {
          members: { $elemMatch: { $eq: guestId } }
        },
        {},
        {
          populate: [
            {
              path: "captain",
              select: "district city ward houseNumber street"
            }
          ]
        }
      )
      return teams
    })
  }

  static async getCaptainTeams(guestId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const teams = await TeamModel.find(
        { captain: guestId },
        {},
        {
          populate: {
            path: "members",
            select: "name avatar"
          }
        }
      )
      return teams
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const team = await TeamModel.findByIdAndUpdate(id, { $set: { status: ETeamStatus.DELETED } })
      if (!team) return Promise.reject(new CustomError("Team không tồn tại", HttpStatusCode.BAD_REQUEST))
      return team
    })
  }
}

export default TeamController
