import { Request, Response, Router } from "express"
import verifyToken from "../middleware/auth"
import { Types } from "mongoose"
import IField from "../interface/IField"
import Field from "../schema/Field"
import Organization from "../schema/Organization"
import IOrganization, { EOrganizationStatus } from "../interface/IOrganization"
import IFieldBookedQueue, { EBOOKED_QUEUE_STATUS } from "../interface/IFieldBookedQueue"
import User from "../schema/User"
import FieldBookedQueue from "../schema/FieldBookedQueue"

const router = Router()
const toId = Types.ObjectId

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, description, organization, price } = req.body as IField
    if (!name || !description || !organization || !price) {
      return res.status(400).json({ success: false, message: "Please enter all fields" })
    }

    const _organization = await Organization.findById(organization)
    if (!_organization) return res.status(404).json({ message: "Organization not found" })
    if (_organization.status === EOrganizationStatus.PENDING || _organization.status === EOrganizationStatus.REJECTED)
      return res.status(400).json({ message: "Organization is not approved yet" })
    const newField = new Field({
      ...req.body,
      organization: _organization._id,
      is_being_used: false
    })
    await newField.save()
    res.status(201).json({ success: true, data: newField })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post("/book", verifyToken, async (req: Request, res: Response) => {
  try {
    const { booked_time, field, time_count } = req.body as IFieldBookedQueue
    if (!booked_time || !field || !time_count) {
      return res.status(400).json({ success: false, message: "Please enter all fields" })
    }
    if (time_count < 1 || time_count > 2) {
      return res.status(400).json({
        success: false,
        message: "Time count must be between 1 and 2"
      })
    }
    if (booked_time <= new Date()) {
      return res.status(400).json({ success: false, message: "Cannot book in the past" })
    }
    const user = await User.findById(req.user_id)
    if (!user) return res.status(404).json({ message: "User not found" })
    const _field = await Field.findById(field).populate("organization")
    if (!_field) return res.status(404).json({ message: "Field not found" })
    const organization = _field.organization as IOrganization
    const bookTime = new Date(booked_time)
    if (bookTime.getHours() < organization.active_at || bookTime.getHours() > organization.inactive_at) {
      return res.status(400).json({ message: "Cannot book at this time" })
    }

    const bookedQueue = await FieldBookedQueue.find({})
    const bookedQueueOfField = bookedQueue.filter((f) => f.field?.toString() === field.toString())

    for (const queue of bookedQueueOfField) {
      if (
        queue.booked_time?.getTime() === bookTime.getTime() ||
        queue.booked_time?.getTime() === bookTime.getTime() + time_count * 3600000
      ) {
        return res.status(400).json({ message: "This time is already booked" })
      }
    }

    const newFieldBookedQueue = new FieldBookedQueue({
      ...req.body,
      booked_by: user._id,
      status: EBOOKED_QUEUE_STATUS.PENDING
    })
    await newFieldBookedQueue.save()
    res.status(201).json({ success: true, data: newFieldBookedQueue })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/", async (req: Request, res: Response) => {
  try {
    const fields = await Field.find()
    res.status(200).json({ success: true, data: fields })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/organization", async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query
    if (!organization_id) return res.status(400).json({ success: false, message: "Please enter all fields" })

    const organization = await Organization.findById(organization_id)
    if (!organization) return res.status(404).json({ message: "Organization not found" })

    const fields = await Field.find({ organization: organization?._id })
    res.status(200).json({ success: true, data: fields })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/booked", verifyToken, async (req: Request, res: Response) => {
  try {
    const fields = await FieldBookedQueue.find({
      booked_by: req.user_id
    }).populate("field")
    res.status(200).json({ success: true, data: fields })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ success: false, message: "Please enter all fields" })
    const field = await Field.findById(id)
    if (!field) return res.status(404).json({ message: "Field not found" })
    res.status(200).json({ success: true, data: field })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/booked/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ success: false, message: "Please enter all fields" })
    const field = await FieldBookedQueue.findById(id)
    if (!field) return res.status(404).json({ message: "Field not found" })
    res.status(200).json({ success: true, data: field })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put("/status/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body as IFieldBookedQueue
    if (!id) return res.status(400).json({ success: false, message: "Please enter all fields" })
    const field = await FieldBookedQueue.findById(id)
    if (!field) return res.status(404).json({ message: "Field not found" })

    if (!Object.values(EBOOKED_QUEUE_STATUS).includes(status!)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    if (status === EBOOKED_QUEUE_STATUS.ACCEPTED) {
      await Field.findByIdAndUpdate(
        field.field,
        {
          $set: {
            is_being_used: true
          }
        },
        { new: true }
      )
    }
    field.status = status
    await field.save()
    res.status(200).json({ success: true, data: field })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ success: false, message: "Please enter all fields" })

    const field = await Field.findByIdAndDelete(id)
    if (!field) return res.status(404).json({ message: "Field not found" })
    res.status(200).json({ success: true, message: "Field deleted", data: field })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
