import express from 'express';

const router = express.Router();

import {
  getMentor,
  getStudent,
  getAllBuddies,
  getLimitedBuddies,
  getAllMentors,
  getLimitedMentors,
} from '../controllers/API/people.js';
import { requireSignin } from '../middlewares/checkAuth.js';

// router.post('/buddies', getBuddies);
router.get('/buddies', getAllBuddies);
router.get('/buddies/limit', getLimitedBuddies);
// router.post('/mentors', getMentors);
router.get('/mentors', getAllMentors);
router.get('/mentors/limit', getLimitedMentors);
router.get('/student/:handle', getStudent);
router.get('/mentor/:handle', getMentor);

export default router;
