import express from "express";
import { signup ,login,logout} from "../controllers/authController";
import { loginRateLimiter } from "../middlewares/loginRateLimiter";
const router = express.Router();

router.post('/signup',signup);
router.post('/login',loginRateLimiter,login);
router.post('/logout',logout);

export default router;