import { Types } from "mongoose"
import { ETournamentStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { ITournament } from "../interface"
import { MatchModel, TeamModel, TournamentModel } from "../models"
import BaseController from "./base.controller"
import BranchController from "./branch.controller"
import TeamController from "./team.controller"
import { SCHEMA } from "../models/schema-name"
import MatchController from "./match.controller"

class TournamentController extends BaseController {
  constructor() {
    super()
  }

  // static async preFind() {
  //   return await super.handleResponse(async () => {
  //     const tournaments = await TournamentModel.find()
  //     for (const tournament of tournaments) {
  //       const { _id, startAt, endAt } = tournament
  //       const now = new Date()
  //       if (now > new Date(startAt) && now < new Date(endAt)) {
  //         await tournament.updateOne({ $set: { status: ETournamentStatus.ONGOING } })
  //       }
  //       if (now > new Date(endAt)) {
  //         await tournament.updateOne({ $set: { status: ETournamentStatus.FINISHED } })
  //       }
  //     }
  //   })
  // }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(
        id,
        {},
        {
          populate: [
            {
              path: "prize",
              select: "-description -branch -createdAt -updatedAt"
            },
            {
              path: "branch",
              select: "logo name ward district city street"
            }
          ]
        }
      )
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      return tournament
    })
  }

  static async getHappenningTournaments() {
    return await super.handleResponse(async () => {
      const tournaments = await TournamentModel.find(
        { status: ETournamentStatus.ONGOING },
        {
          description: 0,
          matches: 0
        },
        {
          populate: [
            {
              path: "prize",
              select: "-description -branch -createdAt -updatedAt"
            },
            {
              path: "branch",
              select: "logo name ward district city street"
            }
          ]
        }
      )
      return tournaments
    })
  }

  static async create(body: ITournament) {
    return await super.handleResponse(async () => {
      const { branch, startAt, endAt } = body
      if (startAt > endAt)
        return Promise.reject(
          new CustomError("Ngày bắt đầu không được lớn hơn ngày kết thúc", HttpStatusCode.BAD_REQUEST)
        )
      if (new Date(startAt).getTime() < new Date().getTime()) {
        return Promise.reject(
          new CustomError("Ngày bắt đầu không được nhỏ hơn ngày hiện tại", HttpStatusCode.BAD_REQUEST)
        )
      }
      await BranchController.validate(branch as string)
      const existingTournaments = await TournamentModel.find({
        branch,
        $or: [
          {
            startAt: { $gt: startAt },
            endAt: { $lt: endAt }
          },
          { startAt: { $lt: endAt }, endAt: { $gt: startAt } }
        ]
      })

      if (existingTournaments.length > 0) {
        return Promise.reject(
          new CustomError("Đã có giải đấu được tạo trong khoảng thời gian này", HttpStatusCode.BAD_REQUEST)
        )
      }
      const tournament = await TournamentModel.create(body)
      const tournamentPopulated = await tournament.populate("prize", "-description -branch")
      return tournamentPopulated
    })
  }

  static async joinTournament(id: string | Types.ObjectId, teamId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const team = await TeamModel.findById(teamId)
      if (!team) {
        return Promise.reject(new CustomError("Đội bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      }
      for (const t of team.jointTournaments) {
        if (t.toString() === id) {
          return Promise.reject(new CustomError("Đội bóng đã tham gia giải đấu", HttpStatusCode.BAD_REQUEST))
        }
      }
      await team.updateOne({ $push: { jointTournaments: id } })
      const jointTournament = await tournament.updateOne({ $push: { teams: team } })
      return jointTournament
    })
  }

  static async getTournamentMatches(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const { data: tournament } = await this.validate(id)
      const { matches } = tournament
      return matches
    })
  }

  static async removeTeam(id: string | Types.ObjectId, team: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const isExist = tournament.teams.find((item) => item.toString() === team.toString())
      if (!isExist) return Promise.reject(new CustomError("Đội bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      const newTournament = await tournament.updateOne({ $pull: { teams: team } })
      return newTournament
    })
  }

  static async updateInfo(id: string | Types.ObjectId, body: ITournament) {
    return await super.handleResponse(async () => {
      const { branch } = body
      await BranchController.validate(branch as string)
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const newTournament = await tournament.updateOne({ $set: body })
      return newTournament
    })
  }

  static async updateStatus(id: string | Types.ObjectId, status: ETournamentStatus) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const newTournament = await tournament.updateOne({ $set: { status } }, { new: true })
      return newTournament
    })
  }

  static async addToTimeline(id: string | Types.ObjectId, matchId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) {
        return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      }
      for (const t of tournament.matches) {
        if (t.toString() === matchId.toString()) {
          return Promise.reject(new CustomError("Trận đấu đã tồn tại", HttpStatusCode.BAD_REQUEST))
        }
      }
      const newTournament = await tournament.updateOne({ $push: { matches: matchId } })
      return newTournament
    })
  }

  static async getAll(queries?: any) {
    return await super.handleResponse(async () => {
      // await this.preFind()
      const { city, district, ward, status, keyword } = queries
      const queryKeys = Object.keys(queries)
      const keywordKeyIndex = queryKeys.indexOf("keyword")
      if (keywordKeyIndex !== -1) queryKeys.splice(keywordKeyIndex, 1)

      let fields = []

      if (keyword) {
        fields = await TournamentModel.find(
          {
            name: { $regex: keyword, $options: "i" }
          },
          {
            branch: 1,
            name: 1,
            prize: 1,
            status: 1,
            startAt: 1,
            endAt: 1,
            teams: 1,
            images: 1
          },
          {
            populate: [
              {
                path: "prize",
                select: "-description -branch -createdAt -updatedAt"
              },
              {
                path: "branch",
                select: "logo name ward district city street"
              }
            ]
          }
        )
      } else {
        fields = await TournamentModel.aggregate([
          {
            $lookup: {
              from: SCHEMA.BRANCHES,
              localField: "branch",
              foreignField: "_id",
              as: "branch",
              pipeline: [
                {
                  $project: {
                    logo: 1,
                    name: 1,
                    ward: 1,
                    district: 1,
                    city: 1,
                    street: 1
                  }
                }
              ]
            }
          },
          {
            $unwind: "$branch"
          },
          {
            $lookup: {
              from: SCHEMA.PRIZES,
              localField: "prize",
              foreignField: "_id",
              as: "prize",
              pipeline: [
                {
                  $project: {
                    image: 1,
                    name: 1,
                    value: 1,
                    winners: 1
                  }
                }
              ]
            }
          },
          {
            $unwind: "$prize"
          },
          {
            $match:
              queryKeys.length > 0
                ? {
                    $and: [
                      {
                        ...(city && {
                          "branch.city": { $eq: city }
                        })
                      },
                      {
                        ...(district && { "branch.district": { $eq: district } })
                      },
                      {
                        ...(ward && { "branch.ward": { $eq: ward } })
                      },
                      {
                        ...(status !== "all" && { status })
                      }
                    ]
                  }
                : {}
          },
          {
            //! TODO: project
            $project: {
              branch: 1,
              name: 1,
              prize: 1,
              status: 1,
              startAt: 1,
              endAt: 1,
              teams: 1,
              images: 1
            }
          }
        ])
      }
      return fields
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournaments = await TournamentModel.findById(
        id,
        {},
        {
          populate: [
            {
              path: "prize",
              select: "name image winners value"
            },
            {
              path: "branch",
              select: "logo name city district ward street"
            },
            {
              path: "teams",
              select: "members jointTournaments name captain logo",
              populate: {
                path: "captain",
                select: "avatar name city district ward street"
              }
            },
            {
              path: "matches",
              select: "leftTeam rightTeam startAt endAt field",
              populate: [
                {
                  path: "leftTeam",
                  select: "name logo"
                },
                {
                  path: "rightTeam",
                  select: "name logo"
                },
                {
                  path: "field",
                  select: "name"
                },
                {
                  path: "leftTeamGoals",
                  select: "scoreAtMinute scoreBy",
                  populate: {
                    path: "scoreBy",
                    select: "name avatar"
                  }
                },
                {
                  path: "rightTeamGoals",
                  select: "scoreAtMinute scoreBy",
                  populate: {
                    path: "scoreBy",
                    select: "name avatar"
                  }
                },
                {
                  path: "fines",
                  select: "cardType player",
                  populate: {
                    path: "player",
                    select: "name avatar"
                  }
                },
                {
                  path: "fines",
                  populate: {
                    path: "player",
                    select: "name avatar"
                  }
                }
              ]
            }
          ]
        }
      )
      return tournaments
    })
  }

  static async getGuestJointTournament(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournaments = await TeamModel.find({
        $or: [{ members: { $elemMatch: { $eq: id } } }, { captain: id }]
      })
        .select("jointTournaments")
        .populate("jointTournaments", "_id name images startAt endAt branch")
      return tournaments
    })
  }

  static async getTournamentsOfBranch(branch_id: string | Types.ObjectId) {
    // await this.preFind()
    return await super.handleResponse(async () => {
      const tournaments = await TournamentModel.find(
        { branch: branch_id },
        {
          matches: 0
        },
        {
          populate: [
            {
              path: "prize",
              select: "-description -branch -createdAt -updatedAt"
            },
            {
              path: "branch",
              select: "logo name ward district city street"
            }
          ]
        }
      )
      return tournaments
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const teams = tournament.teams
      for (const team of teams) {
        const _team = await TeamModel.findById(team)
        if (_team) {
          await _team.updateOne({ $pull: { jointTournaments: id } })
        }
      }
      await tournament.deleteOne()
      return tournament
    })
  }

  static async ranking(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const tournament = await TournamentModel.findById(id)
      if (!tournament) return Promise.reject(new CustomError("Giải đấu không tồn tại", HttpStatusCode.BAD_REQUEST))
      const ranks = await MatchModel.aggregate([
        {
          $lookup: {
            from: SCHEMA.TOURNAMENTS,
            localField: "tournament",
            foreignField: "_id",
            as: "tournament"
          }
        },
        {
          $unwind: "$tournament"
        },
        {
          $project: {
            tournament: 0
          }
        }
      ])
      return ranks
    })
  }
}

export default TournamentController
