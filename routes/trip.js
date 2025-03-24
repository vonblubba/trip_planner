import express from 'express';

import * as tripController from '../controllers/trip.js';
import { isAuth } from '../middleware/is-auth.js';

const router = express.Router();

// GET /trips
router.get('/trips', isAuth, tripController.getTrips);

export default router;
