import { getTeam, joinTeam } from "../controllers/team";
import express from "express";

const router = express.Router()

router.get("/", getTeam);
router.get("/", joinTeam);
export default router