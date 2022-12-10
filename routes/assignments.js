import express from 'express';

const router = express.Router();

import {
  getAllAssignments,
  getLimitedAssignments,
  createNewAssignment,
  getAssignment,
} from '../controllers/API/assignments.js';

import { requireSignin } from '../middlewares/checkAuth.js';

router.get('/', getAllAssignments);
router.get('/limit', getLimitedAssignments);
router.get('/:assignmentId', getAssignment);
router.post('/new', requireSignin, createNewAssignment);
// router.get('/notifications/:userId', requireSignin, getNotifications);
// router.get('/user/:userId', requireSignin, getUserGroups);
// router.get(
//   '/notification-from/:userId/:notificationId',
//   requireSignin,
//   getNotificationFrom
// );
// router.get('/group/pending-join-reqs', getPendingRequests);

export default router;
