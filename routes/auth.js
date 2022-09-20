import express from 'express';

const router = express.Router();

import { signup, activateAccount, testEmail } from '../controllers/auth.js';

router.post('/signup', signup);
router.post('/signup/activate', activateAccount);
router.post('/signup/testemail', testEmail);

export default router;
