import { Request, Response, Router } from "express"
import verifyToken from "../middleware/auth"
import { Types } from "mongoose"
import ITeam from "../interface/ITeam"
import Team from "../schema/Team"
import User from "../schema/User"

const router = Router()
const toId = Types.ObjectId

router.post("/create-team", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body as ITeam

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Please enter all fields" })
    }

    const newTeam = new Team({
      ...req.body,
      owner: new toId(req.user_id)
    })
    await newTeam.save()
    res.status(201).json({ success: true, data: newTeam })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/get-owner-teams", verifyToken, async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({ owner: new toId(req.user_id) })
    res.status(200).json({ success: true, data: teams })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/get-member-teams", verifyToken, async (req: Request, res: Response) => {
  try {
    // from user_id that include in members
    const teams = await User.findById(req.user_id).populate("teams")
    res.status(200).json({ success: true, data: teams?.teams })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete("/leave-team/:team_id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { team_id } = req.params
    const user_id = new toId(req.user_id)
    const team = await Team.findById(team_id)
    if (!team) return res.status(404).json({ message: "Team not found" })

    const user = await User.findById(user_id)
    if (!user) return res.status(404).json({ message: "User not found" })
    console.log(team.members.includes(user_id))
    if (!team.members.includes(user_id)) {
      return res.status(400).json({ success: false, message: "User not in team" })
    }

    team.members = team.members.filter((member) => member !== user_id)
    user.teams = user.teams.filter((team) => team.toString() !== team_id)

    await team.save()
    await user.save()

    res.status(200).json({ success: true, data: team })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
