import { getTeam } from "../controllers/team";
import express from "express";

const router = express.Router()

router.get("/", getTeam);
export default router