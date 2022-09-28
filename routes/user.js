import express from 'express';

const router = express.Router();

import { completeProfile, deleteProfile } from '../controllers/user.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.put('/complete-profile', requireSignin, completeProfile);
router.delete('/delete-profile', requireSignin, deleteProfile);

export default router;
