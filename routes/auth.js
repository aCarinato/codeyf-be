import express from 'express';

const router = express.Router();

import {
  signup,
  activateAccount,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.js';

router.post('/signup', signup);
router.post('/signup/activate', activateAccount);
// router.post('/signup/testemail', testEmail);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

export default router;
