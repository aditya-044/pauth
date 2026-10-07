import { Router } from "express";
import { register, login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);

authRouter.post('/login', validate(loginSchema), login);

authRouter.get('/me', authenticate, getMe);

export { authRouter };
