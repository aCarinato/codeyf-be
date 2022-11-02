import express from 'express';

const router = express.Router();

import {
  getChats,
  // getUsers,
  getUserInfo,
  getNotifications,
} from '../controllers/API/chats.js';

import { requireSignin } from '../middlewares/checkAuth.js';

// router.get('/users/:username', getUsers);
router.get('/', requireSignin, getChats);
router.get('/notifications', requireSignin, getNotifications);
// router.get('/:userId', getChats);
router.get('/:userToFindId', getUserInfo);
// router.get('/notifications/:userId', getNotifications);

// router.get('/current-user', requireSignin, currentUser);

export default router;
