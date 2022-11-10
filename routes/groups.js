import express from 'express';

const router = express.Router();

import {
  getGroup,
  createNewGroup,
  getNotifications,
} from '../controllers/API/groups.js';

import { requireSignin } from '../middlewares/checkAuth.js';

router.get('/:groupId', getGroup);
router.post('/new', requireSignin, createNewGroup);
router.get('/notifications/:userId', requireSignin, getNotifications);

export default router;
