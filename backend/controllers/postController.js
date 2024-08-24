import Post from "../models/post.js";
import asyncHandler from "express-async-handler";

//Create a new post

const createPost = asyncHandler(async (req, res) => {
    const {title, content} = req.body;
    try {
        if (!title || !content) {
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const newPost = new Post({title, content, author: req.user._id});
        await newPost.save();
        //populate the author field

        // Fetch the saved post and populate author and comments
        const populatedPost = await Post.findById(newPost._id)
            .populate('author')    
            .populate('comments'); 

        res.status(201).json({
            message: "Post created successfully",
            post: populatedPost
        });
    } catch (error) {
        console.error(error.message);
        res.status(400);
        throw new Error(error.message);
    }
})


const getPosts = asyncHandler(async (req, res) => {  
    try {
  
      const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('author')
        .populate({
          path: 'comments',
          populate: {
              path: 'user'
          }
        })
  
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });


  //get my post

  const getPostById = asyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.user._id)
        .populate('author')
        .populate({
          path: 'comments',
          populate: {
              path: 'user'
          }
        })
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post fetched successfully', post });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });
  
  //get post by id
  //get my post

  const getUserPost = asyncHandler(async (req, res) => {
  
    try {
      const posts = await Post.find({author: req.params.id})
      .populate('author')
      .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
      })
  
      if (!posts) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post fetched successfully', posts });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });


  //update a post
  const updatePost = asyncHandler(async (req, res) => {

    const { title, content } = req.body;
    
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id, 
        { title, content }, 
        { new: true }
      ).populate('author')
      .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
      })

  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to update post' });
    }
  });
  
  //Delete a post
  const deletePost = asyncHandler(async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to delete post' });
    }
  });
  


  export { createPost, getPosts, getPostById, updatePost, deletePost, getUserPost };
