import { Request, Response, Router } from "express"
import verifyToken from "../middleware/auth"
import { Types } from "mongoose"
import IOrganization, { EOrganizationStatus } from "../interface/IOrganization"
import Organization from "../schema/Organization"
import User from "../schema/User"
import { EUserRole } from "../interface/IUser"

const router = Router()
const toId = Types.ObjectId

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, description, address, phone_number, email, active_at, inactive_at } = req.body as IOrganization
    if (!name || !description || !address || !phone_number || !email || !active_at || !inactive_at) {
      return res.status(400).json({ success: false, message: "Please enter all fields" })
    }

    if (active_at >= inactive_at) {
      return res.status(400).json({
        success: false,
        message: "Active time must be before inactive time"
      })
    }

    const newOrganization = new Organization({
      ...req.body,
      owner: new toId(req.user_id),
      status: EOrganizationStatus.PENDING
    })
    await newOrganization.save()
    res.status(201).json({ success: true, data: newOrganization })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put("/status/:organization_id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.params
    const { status } = req.body
    if (!status) return res.status(400).json({ message: "Please provide status" })

    const user = await User.findById(req.user_id)
    if (!user) return res.status(404).json({ message: "User not found" })
    if (user.role !== EUserRole.ADMIN) return res.status(403).json({ message: "You don't have permission to do this" })

    if (!Object.values(EOrganizationStatus).includes(status)) return res.status(400).json({ message: "Invalid status" })

    const organization = await Organization.findById(organization_id)
    if (!organization) return res.status(404).json({ message: "Organization not found" })

    if (organization.status === status) {
      return res.status(400).json({ message: "Status already set" })
    }

    await organization.updateOne(
      {
        $set: {
          status
        }
      },
      {
        new: true
      }
    )
    res.status(200).json({
      success: true,
      message: "Update success",
      data: { ...organization.toJSON(), status }
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put("/:organization_id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.params
    const organization = await Organization.findById(organization_id)
    if (!organization) return res.status(404).json({ message: "Organization not found" })

    await organization.updateOne(
      {
        $set: {
          ...req.body
        }
      },
      {
        new: true
      }
    )
    res.status(200).json({
      success: true,
      message: "Update success",
      data: { ...organization.toJSON(), ...req.body }
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/", async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.find()
    res.status(200).json({ success: true, data: organizations })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/owner", verifyToken, async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.find({
      owner: new toId(req.user_id)
    })
    res.status(200).json({ success: true, data: organizations })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/:organization_id", async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.params
    const organization = await Organization.findById(organization_id)
    if (!organization) return res.status(404).json({ message: "Organization not found" })
    res.status(200).json({ success: true, data: organization })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete("/:organization_id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.params
    const organization = await Organization.findById(organization_id)
    if (!organization) return res.status(404).json({ message: "Organization not found" })
    await organization.deleteOne()
    res.status(200).json({ success: true, message: "Delete success", data: organization })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
