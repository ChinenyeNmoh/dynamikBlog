import express from 'express';
import {protect, ensureGuest, validateId} from '../middlewares/authMiddlewares.js';

import {
    createComment, 
    getCommentsByPost, 
     deleteComment,
      getCommentById 
} from '../controllers/commentController.js';
const router = express.Router();

router.post('/:id/create', protect, createComment);
router.get('/', getCommentsByPost);
router.delete('/:id', protect, validateId, deleteComment);
router.get('/:id', getCommentById);


export default router;