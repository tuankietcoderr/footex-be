import { Request, Response, Router } from 'express'
import verifyToken from '../middleware/auth'
import { Types } from 'mongoose'
import IFootballShop, { EFootballShopStatus } from '../interface/IFootballShop'
import FootballShop from '../schema/FootballShop'

const router = Router()
const toId = Types.ObjectId

router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, description, address, phone_number, email, active_at, inactive_at } = req.body as IFootballShop
    if (!name || !description || !address || !phone_number || !email || !active_at || !inactive_at) {
      return res.status(400).json({ success: false, message: 'Please enter all fields' })
    }

    if (active_at >= inactive_at) {
      return res.status(400).json({
        success: false,
        message: 'Active time must be before inactive time'
      })
    }

    const newFootballShop = new FootballShop({
      ...req.body,
      owner_id: new toId(req.user_id),
      status: EFootballShopStatus.PENDING
    })
    await newFootballShop.save()
    res.status(201).json({ success: true, data: newFootballShop })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/status/:footballshop_id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { footballshop_id } = req.params
    const { status } = req.body
    if (!status) return res.status(400).json({ message: 'Please provide status' })

    if (!Object.values(EFootballShopStatus).includes(status)) return res.status(400).json({ message: 'Invalid status' })

    const footballshop = await FootballShop.findById(footballshop_id)
    if (!footballshop) return res.status(404).json({ message: 'FootballShop not found' })

    if (footballshop.status === status) {
      return res.status(400).json({ message: 'Status already set' })
    }

    await footballshop.updateOne(
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
      message: 'Update success',
      data: { ...footballshop.toJSON(), status }
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:footballshop_id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { footballshop_id } = req.params
    const footballshop = await FootballShop.findById(footballshop_id)
    if (!footballshop) return res.status(404).json({ message: 'FootballShop not found' })

    await footballshop.updateOne(
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
      message: 'Update success',
      data: { ...footballshop.toJSON(), ...req.body }
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const footballshops = await FootballShop.find()
    res.status(200).json({ success: true, data: footballshops })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/owner', verifyToken, async (req: Request, res: Response) => {
  try {
    const footballshops = await FootballShop.find({
      owner_id: new toId(req.user_id)
    })
    res.status(200).json({ success: true, data: footballshops })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/:footballshop_id', async (req: Request, res: Response) => {
  try {
    const { footballshop_id } = req.params
    const footballshop = await FootballShop.findById(footballshop_id)
    if (!footballshop) return res.status(404).json({ message: 'FootballShop not found' })
    res.status(200).json({ success: true, data: footballshop })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/:footballshop_id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { footballshop_id } = req.params
    const footballshop = await FootballShop.findById(footballshop_id)
    if (!footballshop) return res.status(404).json({ message: 'FootballShop not found' })
    await footballshop.deleteOne()
    res.status(200).json({ success: true, message: 'Delete success', data: footballshop })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
