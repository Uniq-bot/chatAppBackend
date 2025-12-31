import express from 'express';
import {sendChatMessage, getMessagesOfID, sendGroupMessage, getGroupMessagesOfID, getContacts} from '../controller/chat.controller.js';
import { authenticationOfToken } from '../middlewares/auth.middleware.js';
const router= express.Router();


router.get('/messages/:id',authenticationOfToken, getMessagesOfID)
router.post('/sendMessage/:id',authenticationOfToken, sendChatMessage);
router.post('/sendGroupMessage/:groupId', authenticationOfToken, sendGroupMessage);
router.get('/groupMessages/:groupId', authenticationOfToken, getGroupMessagesOfID);
router.get('/contacts', authenticationOfToken, getContacts);
export default router;