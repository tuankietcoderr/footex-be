import { Request, Response, Router } from 'express'
import { Types } from 'mongoose'
import verifyToken from '../middleware/auth'
import IInvitement, { EInvitementStatus } from '../interface/IInvitement'
import Team from '../schema/Team'
import Invite from '../schema/Invite'
import IUser from '../interface/IUser'
import User from '../schema/User'

const router = Router()
const toId = Types.ObjectId

router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { team_id, user_id } = req.body as IInvitement
    const team = await Team.findById(team_id).populate('owner_id')
    if (!team) return res.status(404).json({ message: 'Team not found' })

    const currInvite = await Invite.findOne({ team_id, user_id })

    if (currInvite) {
      return res.status(400).json({ message: 'Invite already sent' })
    }

    const user = await User.findById(user_id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const invite = await Invite.create({
      team_id,
      user_id,
      title: (team.owner_id as IUser).name + ' invited you to join ' + team.name,
      owner_title: 'You invite ' + user.name + ' to join ' + team.name + ' team',
      status: EInvitementStatus.PENDING
    })
    res.status(200).json({ success: true, data: invite })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/status/:invite_id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { invite_id } = req.params
    const { status } = req.body
    const invite = await Invite.findById(invite_id)
    if (!invite) return res.status(404).json({ message: 'Invite not found' })

    const team = await Team.findById(invite.team_id)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    const user = await User.findById(invite.user_id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const user_id = new toId(req.user_id)

    switch (status as EInvitementStatus) {
      case EInvitementStatus.ACCEPTED:
        if (team.members?.includes(new toId(user_id))) {
          return res.status(400).json({ success: false, message: 'User already in team' })
        }
        if (user.teams?.includes(new toId(team._id))) {
          return res.status(400).json({ success: false, message: 'User already in team' })
        }
        team.members.push(user_id)
        user.teams.push(team._id)
        await team.save()
        await user.save()
        break
      case EInvitementStatus.REJECTED:
        break
      default:
        return res.status(400).json({ message: 'Invalid status' })
    }

    invite.status = status
    await invite.save()

    res.status(200).json({ success: true, data: invite })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/owner', verifyToken, async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({ owner_id: req.user_id })
    const invites = await Invite.find({
      team_id: {
        $in: teams.map((team) => team._id)
      }
    })
    res.status(200).json({ success: true, data: invites })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/member', verifyToken, async (req: Request, res: Response) => {
  try {
    const invites = await Invite.find({ user_id: req.user_id })
    res.status(200).json({ success: true, data: invites })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/:invite_id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { invite_id } = req.params
    const invite = await Invite.findById(invite_id)
    if (!invite) return res.status(404).json({ message: 'Invite not found' })
    await invite.deleteOne()
    res.status(200).json({ success: true, data: invite })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
