import express from 'express';

const router= express.Router();

import { searchGroupController, getAllGroupsController } from '../controller/getGroup.controller.js';

router.get('/all', getAllGroupsController);
router.get('/search/:name', searchGroupController);  

export default router;