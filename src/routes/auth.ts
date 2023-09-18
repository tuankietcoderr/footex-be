import express, { Response, Request } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"
import verifyToken from "../middleware/auth"
import User from "../schema/User"
import Credential from "../schema/Credential"
import IUser, { EUserRole } from "../interface/IUser"
import bcrypt from "bcryptjs"
import { sendMail } from "../service/mailer"

const router = express.Router()
const toId = Types.ObjectId

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(new toId(req.user_id)).select("-password")
    if (!user) return res.status(400).json({ success: false, message: "User not found" })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

router.put("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(new toId(req.user_id))
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" })
    }
    const update = {
      ...user.toJSON(),
      ...req.body
    }
    await user.updateOne(update, {
      new: true
    })
    res.json({ success: true, message: "User updated", data: update })
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.post("/signup", async (req: Request, res: Response) => {
  const { username, password, role, name } = req.body as IUser

  if (!username || !password || !role || !name)
    return res.status(400).json({ success: false, message: "Please enter all fields" })

  if (!Object.values(EUserRole).includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" })
  }

  if (role === EUserRole.ADMIN) {
    return res.status(403).json({ success: false, message: "You don't have permission to create this role" })
  }

  try {
    const user = await User.findOne({ username })
    if (user) return res.status(400).json({ success: false, message: "User already exists" })

    const newUser = new User({
      ...req.body
    })
    await newUser.save()
    const bcryptPassword = await bcrypt.hash(password, 10)
    const newCredential = new Credential({
      userId: newUser._id,
      password: bcryptPassword
    })
    await newCredential.save()

    const accessToken = jwt.sign({ user_id: newUser._id.toString() }, process.env.JWT_SECRET!, { expiresIn: "1y" })
    res.json({
      success: true,
      message: "User created",
      accessToken,
      data: newUser
    })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.post("/signin", async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ success: false, message: "Missing username/password" })
  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ success: false, message: "User does not exist" })

    const credential = await Credential.findOne({
      userId: user._id
    })

    if (!credential) {
      return res.status(400).json({ success: false, message: "User does not exist" })
    }

    const isMatch = await bcrypt.compare(password, credential.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Wrong password" })
    }

    const accessToken = jwt.sign({ user_id: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: "1y" })
    res.json({
      success: true,
      message: "User logged in",
      accessToken,
      data: user
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

router.post("/send-email", async (req, res) => {
  try {
    const { email } = req.query
    const hashedEmail = await bcrypt.hash(email as string, 10)
    sendMail({
      to: email as string,
      subject: "Xác thực email của bạn tại Footex",
      text: `Chào bạn,\n\nBạn vui lòng xác thực email của mình bằng cách nhấn vào đường dẫn sau: \n\n${process.env.URL}/verify-email?email=${email}&token=${hashedEmail}\n\nTrân trọng,\nHỏi đáp Dịch vụ công`
    })
    res.status(200).json({ success: true, message: "Đã gửi email" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get("/verify-email", async (req, res) => {
  try {
    const { email, token } = req.query
    const isMatch = await bcrypt.compare(email as string, token as string)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Không thể xác thực email, có lỗi xảy ra"
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "Người dùng không tồn tại" })
    }

    user.is_email_verified = true
    await user.save()

    res.render("email-verified", { email })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/forgot-password", async (req, res) => {
  try {
    const { email } = req.query

    const randomPassword = Math.random().toString(36).slice(-8)

    const hashedPassword = await bcrypt.hash(randomPassword, 10)

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "Người dùng không tồn tại" })
    }

    if (!user.is_email_verified) {
      return res.status(400).json({ success: false, message: "Email chưa được xác thực" })
    }

    const credential = await Credential.findOne({ userId: user._id })
    if (!credential) {
      return res.status(400).json({ success: false, message: "Người dùng không tồn tại" })
    }

    credential.password = hashedPassword

    await credential.save()

    sendMail({
      to: email as string,
      subject: "Đặt lại mật khẩu của bạn tại Hỏi đáp Dịch vụ công",
      text: `Chào bạn,\n\nĐây là mật khẩu được đặt lại của bạn: ${randomPassword}. Hãy sử dụng mật khẩu nãy để đăng nhập bạn nhé!\nBạn cũng có thể thay đổi lại mật khẩu sau trong phần cài đặt người dùng.\n\nTrân trọng,\nHỏi đáp Dịch vụ công`
    })
    res.status(200).json({ success: true, message: "Đã gửi email" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
