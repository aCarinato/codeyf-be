import express from 'express';

const router = express.Router();

import { getGroup, createNewGroup } from '../controllers/API/groups.js';

import { requireSignin } from '../middlewares/checkAuth.js';

router.get('/:groupId', getGroup);
router.post('/new', requireSignin, createNewGroup);

export default router;
