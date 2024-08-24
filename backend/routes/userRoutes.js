import express from 'express';
import {protect, ensureGuest, validateId} from '../middlewares/authMiddlewares.js';
import {
    loginUser, 
    verifyToken, 
    registerUser, 
    forgotPassword, 
    resetPassword, 
    updatePassword, 
    logOut ,
    getUserProfile,
    
} from '../controllers/userController.js';
    
const router = express.Router();


router.post('/register', ensureGuest, registerUser);
router.post('/forgotpassword', ensureGuest, forgotPassword);
router.post('/login', ensureGuest, loginUser);
router.get('/profile', protect, getUserProfile);
router.get("/resetpassword/:id/:token", ensureGuest, validateId, resetPassword);
router.get('/verify/:id/:token', validateId, verifyToken);
router.put("/updatepassword/:id", ensureGuest, validateId, updatePassword);

router.get('/logout', protect, logOut);

export default router;