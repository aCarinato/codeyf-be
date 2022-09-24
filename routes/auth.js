import express from 'express';

const router = express.Router();

import {
  signup,
  activateAccount,
  forgotPassword,
  resetPassword,
  login,
  currentUser,
} from '../controllers/auth.js';

import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/signup', signup);
router.post('/signup/activate', activateAccount);
// router.post('/signup/testemail', testEmail);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.post('/login', login);
router.get('/current-user', requireSignin, currentUser);

export default router;
