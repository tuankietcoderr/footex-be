import { Request, Response, Router } from "express";
import verifyToken from "../middleware/auth";
import { Types } from "mongoose";
import ITournament from "../interface/ITournament";
import Tournament from "../schema/Tournament";
import Team from "../schema/Team";
import User from "../schema/User";

const router = Router();
const toId = Types.ObjectId;

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, description, end_date, start_date } = req.body as ITournament;
    if (!name || !description || !end_date || !start_date) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    if (end_date <= start_date)
      return res
        .status(400)
        .json({ success: false, message: "End date must be after start date" });

    const newTournament = new Tournament({
      ...req.body,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      organizer_id: new toId(req.user_id),
    });
    await newTournament.save();
    res.status(201).json({ success: true, data: newTournament });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  "/join/:tournament_id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { tournament_id } = req.params;
      const { team_id } = req.body;
      if (!tournament_id || !team_id) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter all fields" });
      }
      const team = await Team.findById(team_id);
      if (!team) return res.status(404).json({ message: "Team not found" });

      if (team.owner_id.toString() !== req.user_id) {
        return res.status(401).json({
          message: "You must be the owner of this team to join this tournament",
        });
      }

      const tournament = await Tournament.findById(tournament_id);
      if (!tournament)
        return res.status(404).json({ message: "Tournament not found" });

      if (tournament.teams.includes(team._id))
        return res
          .status(400)
          .json({ message: "This team has already joined this tournament" });

      tournament.teams.push(team._id);
      await tournament.save();
      res.status(201).json({ success: true, data: tournament });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json({ success: true, data: tournaments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/guest", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user_id).select("teams");
    if (!user) return res.status(404).json({ message: "User not found" });
    const ownTeams = await Team.find({ owner_id: user._id }).select("_id");
    const teams = [
      ...user.teams.map((t) => t._id),
      ...ownTeams.map((t) => t._id),
    ];
    const tournaments = await Tournament.find({
      teams: { $in: teams },
    });
    res.status(200).json({ success: true, data: tournaments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    const tournament = await Tournament.findById(id).populate("teams");
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });
    res.status(200).json({ success: true, data: tournament });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });

    const tournament = await Tournament.findById(id);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    await tournament.updateOne(
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ success: true, data: { ...tournament.toJSON(), ...req.body } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    const tournament = await Tournament.findById(id);
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    if (tournament.organizer_id.toString() !== req.user_id) {
      return res.status(401).json({
        message: "You must be the organizer of this tournament to delete it",
      });
    }

    await tournament.deleteOne();
    res.status(200).json({ success: true, data: tournament });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
