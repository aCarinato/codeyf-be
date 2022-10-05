import express from 'express';

const router = express.Router();

import { getPeople, getMentor, getStudent } from '../controllers/people.js';

router.get('/', getPeople);
router.get('/student/:handle', getStudent);
router.get('/mentor/:handle', getMentor);

export default router;
