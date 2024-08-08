import { createTeam, getTeam, joinTeam } from "../controllers/team";
import express from "express";

const router = express.Router();

router.get("/", getTeam);
router.post("/", createTeam);
router.get("/join", joinTeam);
export default router;
