import { createTeam, getTeam, joinTeam, leaveTeam } from "../controllers/team";
import express from "express";

const router = express.Router();

router.get("/", getTeam);
router.post("/", createTeam);
router.post("/join", joinTeam);
router.post("/leave", leaveTeam);
export default router;
