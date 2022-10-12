import express from 'express';

const router = express.Router();

import {
  startConversation,
  renderConversations,
  readLastMsg,
} from '../controllers/message.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/start-conversation', requireSignin, startConversation);
router.get('/render-conversations', requireSignin, renderConversations);
router.put('/read-last-msg', requireSignin, readLastMsg);

export default router;
