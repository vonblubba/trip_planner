import express from 'express';

import * as authController from '../controllers/auth.js';

const router = express.Router();

router.post('/login', authController.login);

export default router;