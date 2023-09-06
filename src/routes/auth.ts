import express, { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import verifyToken from '../middleware/auth'
import User from '../schema/User'
import Credential from '../schema/Credential'
import IUser, { EUserRole } from '../interface/IUser'
import bcrypt from 'bcryptjs'

const router = express.Router()
const toId = Types.ObjectId

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(new toId(req.user_id)).select('-password')
    if (!user) return res.status(400).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

router.put('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(new toId(req.user_id))
    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist' })
    }
    const update = {
      ...user.toJSON(),
      ...req.body
    }
    await user.updateOne(update, {
      new: true
    })
    res.json({ success: true, message: 'User updated', data: update })
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.post('/signup', async (req: Request, res: Response) => {
  const { username, password, role, name } = req.body as IUser

  if (!username || !password || !role || !name)
    return res.status(400).json({ success: false, message: 'Please enter all fields' })

  if (!Object.values(EUserRole).includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' })
  }
  try {
    const user = await User.findOne({ username })
    if (user) return res.status(400).json({ success: false, message: 'User already exists' })

    const newUser = new User({
      username,
      role
    })
    await newUser.save()
    const bcryptPassword = await bcrypt.hash(password, 10)
    const newCredential = new Credential({
      userId: newUser._id,
      password: bcryptPassword
    })
    await newCredential.save()

    const accessToken = jwt.sign({ user_id: newUser._id.toString() }, process.env.JWT_SECRET!, { expiresIn: '1y' })
    res.json({
      success: true,
      message: 'User created',
      accessToken,
      data: newUser
    })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.post('/signin', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing username/password' })
  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ success: false, message: 'User does not exist' })

    const credential = await Credential.findOne({
      userId: user._id
    })

    if (!credential) {
      return res.status(400).json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, credential.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Wrong password' })
    }

    const accessToken = jwt.sign({ user_id: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: '1y' })
    res.json({
      success: true,
      message: 'User logged in',
      accessToken,
      data: user
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

export default router
