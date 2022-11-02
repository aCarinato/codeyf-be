import express from 'express';

const router = express.Router();

import {
  getMentor,
  getStudent,
  getBuddies,
  getMentors,
} from '../controllers/API/people.js';
import { requireSignin } from '../middlewares/checkAuth.js';

// router.post('/buddies', getBuddies);
router.get('/buddies', getBuddies);
// router.post('/mentors', getMentors);
router.get('/mentors', getMentors);
router.get('/student/:handle', getStudent);
router.get('/mentor/:handle', getMentor);

export default router;
