import express from 'express';
import {protect, ensureGuest, validateId} from '../middlewares/authMiddlewares.js';
import{
    createPost, 
    getPosts, 
    getPostById, 
    updatePost, 
    deletePost,
    getUserPost
} from '../controllers/postController.js';

const router = express.Router();


//routes

router.post('/create', protect, createPost);
router.get('/', getPosts);
router.get('/', validateId, getPostById);
router.put('/:id', validateId, protect, updatePost);
router.delete('/:id', validateId, protect, deletePost);
router.get('/:id', getUserPost);

export default router;