import express from 'express';
import {sendChatMessage, getMessagesOfID} from '../controller/chat.controller.js';
import { authenticationOfToken } from '../middlewares/auth.middleware.js';
const router= express.Router();


router.get('/messages/:id',authenticationOfToken, getMessagesOfID)
router.post('/sendMessage/:id',authenticationOfToken, sendChatMessage);
export default router;