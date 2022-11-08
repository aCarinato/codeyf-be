import express from 'express';

const router = express.Router();

import { createNewGroup } from '../controllers/API/groups.js';

import { requireSignin } from '../middlewares/checkAuth.js';

// router.get('/users/:username', getUsers);
router.post('/new', requireSignin, createNewGroup);

export default router;
