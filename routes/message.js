import express from 'express';

const router = express.Router();

import {
  startConversation,
  renderConversations,
  readLastMsg,
  renderAdminNotifications,
  readAdminNotification,
} from '../controllers/message.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/start-conversation', requireSignin, startConversation);
router.get('/render-conversations', requireSignin, renderConversations);
router.put('/read-last-msg', requireSignin, readLastMsg);
router.get('/render-notifications', requireSignin, renderAdminNotifications);
router.put('/read-notification', requireSignin, readAdminNotification);

export default router;
