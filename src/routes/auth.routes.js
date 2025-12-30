import express from 'express';
import { registerUser, loginUser, updateProfile, createGroup, joinGroup } from '../controller/auth.controller.js';
import { authenticationOfToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
const router=express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser );
// Use multer to accept single file field named 'pic'
router.put(
  "/update-profile",
  authenticationOfToken,
  (req, res, next) => {
    upload.single("pic")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({ message: "Image too large. Max 5MB" });
        }
        return res.status(400).json({ message: err.message || "Upload error" });
      }
      next();
    });
  },
  updateProfile
);

router.post('/createGroup', authenticationOfToken, (req, res, next) => {
  upload.single("pic")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "Image too large. Max 5MB" });
      }
      return res.status(400).json({ message: err.message || "Upload error" });
    }
    next();
  });
}, createGroup);
router.post('/joinGroup/:groupId', authenticationOfToken, joinGroup);


export default router;