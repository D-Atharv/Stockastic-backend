import express, { Request, Response } from "express";
import { adminAuthorization } from "../middlewares/adminAuthorization";

const router = express.Router();

router.get('/admin/stocks', adminAuthorization, (req: Request, resp: Response) => {
    // Implementation to list users or perform admin actions
    resp.send('Admin stock page');
});

export default router;