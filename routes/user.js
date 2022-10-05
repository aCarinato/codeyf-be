import express from 'express';

const router = express.Router();

import {
  getUser,
  completeProfile,
  deleteProfile,
  readNotifications,
} from '../controllers/user.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/', requireSignin, getUser);
router.put('/complete-profile', requireSignin, completeProfile);
router.delete('/delete-profile', requireSignin, deleteProfile);
router.put('/read-notifications', requireSignin, readNotifications);

export default router;
