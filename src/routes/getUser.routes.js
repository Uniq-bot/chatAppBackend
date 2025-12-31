import express from 'express';
import { getUserController } from '../controller/getUser.controller.js';
import { getUserByNameController, checkAuthController } from '../controller/getUser.controller.js';
import { authenticationOfToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get user by ID from params
router.get('/users/:id', authenticationOfToken, getUserController);

// Check authentication
router.get('/checkAuth', authenticationOfToken, checkAuthController);
// Get user by name
router.get('/users/by-name/:name', authenticationOfToken, getUserByNameController);

export default router;