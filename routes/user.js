import express from 'express';
import formidable from 'express-formidable';

const router = express.Router();

import {
  getUser,
  completeProfile,
  deleteProfile,
  readNotifications,
  uploadImage,
} from '../controllers/API/user.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/', requireSignin, getUser);
router.put('/complete-profile', requireSignin, completeProfile);
router.delete('/delete-profile', requireSignin, deleteProfile);
router.put('/read-notifications', requireSignin, readNotifications);
router.post(
  '/upload-image',
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

export default router;
