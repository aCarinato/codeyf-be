import express from 'express';

const router = express.Router();

import { signup, activateAccount } from '../controllers/auth.js';

router.post('/signup', signup);
router.post('/signup/activate', activateAccount);

export default router;
