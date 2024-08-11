// src/routes/transactionRoutes.ts
import { Router } from 'express';
import { getHoldingsByTeam, sellStock } from '../controllers/holdingsController';
import { Authorization } from '../middlewares/authorization';
const router = Router();

router.get('/holdings', getHoldingsByTeam);
// router.post('/holdings',Authorization, sellStock);
router.post('/holdings', sellStock);



export default router;
