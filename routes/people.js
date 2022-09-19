import express from 'express';

const router = express.Router();

import { getPeople } from '../controllers/people.js';

router.get('/', getPeople);

export default router;
