import { Router } from "express";
import { exportBackup, importBackup } from '../controllers/backupController.js';
import { authenticate } from '../middleware/auth.js'
import { backupImportSchema } from "../validations/backupValidation.js";
import { validate } from "../middleware/validate.js";

const backupRouter = Router();

backupRouter.get('/export', authenticate, exportBackup);

backupRouter.post('/import', validate(backupImportSchema), authenticate, importBackup);

export { backupRouter };
