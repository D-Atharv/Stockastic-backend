import { getTeam, joinTeam, getWalletBalance } from "../controllers/team";
import express from "express";

const router = express.Router()

router.get("/", getTeam);
router.get("/", joinTeam);
router.get('/', getWalletBalance);
export default router