import express from 'express';

const router = express.Router();

import { getMentor, getStudent, getBuddies } from '../controllers/people.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.get('/buddies', getBuddies);
router.get('/student/:handle', getStudent);
router.get('/mentor/:handle', getMentor);

export default router;
