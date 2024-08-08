import { createTeam, getTeam, joinTeam } from "../controllers/team";
import express from "express";

const router = express.Router();

router.get("/", getTeam);
router.post("/", createTeam);
router.post("/join", joinTeam);
export default router;
