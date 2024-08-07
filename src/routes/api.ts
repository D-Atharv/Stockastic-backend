import express from "express";
import teamRouter from "./teamRouter";
import stockRouter from "./stockRouter";

const router = express.Router();

router.use('/team', teamRouter);
router.use('/stock', stockRouter);

export default router;