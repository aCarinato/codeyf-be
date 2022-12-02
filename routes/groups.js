import express from 'express';

const router = express.Router();

import {
  getAllGroups,
  getGroup,
  createNewGroup,
  getNotifications,
  getUserGroups,
  getBuddyPartakenGroups,
  getMentorPartakenGroups,
  getNotificationFrom,
  getPendingRequests,
  checkRequirement,
  approveCompletion,
} from '../controllers/API/groups.js';

import { requireSignin } from '../middlewares/checkAuth.js';

router.get('/', getAllGroups);
router.get('/:groupId', getGroup);
router.post('/new', requireSignin, createNewGroup);
router.get('/notifications/:userId', requireSignin, getNotifications);
router.get('/user/:userId', requireSignin, getUserGroups);
router.get(
  '/user/buddy-partaken/:userId',
  requireSignin,
  getBuddyPartakenGroups
);
router.get(
  '/user/mentor-partaken/:userId',
  requireSignin,
  getMentorPartakenGroups
);
router.get(
  '/notification-from/:userId/:notificationId',
  requireSignin,
  getNotificationFrom
);
router.get('/group/pending-join-reqs', getPendingRequests);
router.put('/group/check-requirement', requireSignin, checkRequirement);
router.put('/group/approve-completion', requireSignin, approveCompletion);

export default router;
