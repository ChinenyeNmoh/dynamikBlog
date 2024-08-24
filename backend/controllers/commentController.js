import Comment from '../models/comments.js';
import asyncHandler from 'express-async-handler';
import Post from '../models/post.js';

const createComment = asyncHandler(async (req, res) => {
    const { id:postId, comment } = req.body;

    try {
        const post = await Post.findById(postId)
        .populate('comments');

    
    
        const alreadyCommented = post.comments.find(c => c?.user?.toString() === req?.user?._id.toString());
        
        let newComment;
        if(alreadyCommented){
            // Update the comment
            console.log('updating comment');
            newComment = await Comment.findByIdAndUpdate(alreadyCommented._id, { comment }, { new: true }).populate('user');
            return res.status(200).json({ 
                message: 'Comment updated successfully', 
                comment: newComment 
            });
        } else {
            console.log('creating comment');
            // Create a new comment
            newComment = await Comment.create({
                user: req.user._id,  
                post: postId,
                comment,
            });
            
            post.comments.push(newComment._id);
            await post.save(); // Save the post to persist the comment reference

            //populate the user field
            const populatedComment = await Comment.findById(newComment._id).populate('user');

            return res.status(201).json({ message: 'Comment created successfully', comment: populatedComment });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to create comment' });
    }
});

// Get all comments for a specific post
const getCommentsByPost = asyncHandler(async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: 'Comments fetched successfully', comments });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
});


// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }


        await comment.deleteOne(); // Delete the comment
        await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } }); // Remove the comment reference from the post

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});


//get a single comment
const getCommentById = asyncHandler(async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate('user', 'name')
            .populate('post');

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment fetched successfully', comment });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to fetch comment' });
    }
});


export { createComment, getCommentsByPost, deleteComment, getCommentById };
