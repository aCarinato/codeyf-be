import express from 'express';

const router = express.Router();

import {
  currentUserIsAdmin,
  createUser,
  mentorApproval,
  approveMentorRequest,
  rejectMentorRequest,
} from '../controllers/API/admin.js';
import { requireSignin, requireAdmin } from '../middlewares/checkAuth.js';

router.get('/current-admin', requireSignin, currentUserIsAdmin);
router.post('/create-user', requireSignin, requireAdmin, createUser);
router.get('/mentor-approval', requireSignin, requireAdmin, mentorApproval);
router.put(
  '/approve-mentor-req',
  requireSignin,
  requireAdmin,
  approveMentorRequest
);
router.put(
  '/reject-mentor-req',
  requireSignin,
  requireAdmin,
  rejectMentorRequest
);
// router.get('/orders', requireSignin, requireAdmin, getOrders);
// router.put('/orders/:id/deliver', requireSignin, requireAdmin, deliverOrder);

export default router;
