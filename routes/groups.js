import express from 'express';

const router = express.Router();

import {
  getAllGroups,
  getGroup,
  createNewGroup,
  getNotifications,
  getUserGroups,
  getNotificationFrom,
  getPendingRequests,
  checkRequirement,
} from '../controllers/API/groups.js';

import { requireSignin } from '../middlewares/checkAuth.js';

router.get('/', getAllGroups);
router.get('/:groupId', getGroup);
router.post('/new', requireSignin, createNewGroup);
router.get('/notifications/:userId', requireSignin, getNotifications);
router.get('/user/:userId', requireSignin, getUserGroups);
router.get(
  '/notification-from/:userId/:notificationId',
  requireSignin,
  getNotificationFrom
);
router.get('/group/pending-join-reqs', getPendingRequests);
router.put('/group/check-requirement', requireSignin, checkRequirement);

export default router;
