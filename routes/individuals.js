import express from 'express';

const router = express.Router();

import {
  getAllStudentsSeekingMentors,
  getLimitedStudentsSeekingMentors,
  getAllMentorsSeekingStudents,
  getLimitedMentorsSeekingStudents,
} from '../controllers/API/individuals.js';

router.get('/students', getAllStudentsSeekingMentors);
router.get('/students/limit', getLimitedStudentsSeekingMentors);
router.get('/mentors', getAllMentorsSeekingStudents);
router.get('/mentors/limit', getLimitedMentorsSeekingStudents);

export default router;
