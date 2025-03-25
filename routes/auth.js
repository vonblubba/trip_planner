import express from 'express';

import * as authController from '../controllers/auth.js';
import { isAuth } from '../middleware/is-auth.js';

const router = express.Router();

router.post('/login', authController.login);

export default router;