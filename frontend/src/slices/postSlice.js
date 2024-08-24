import { createSlice } from '@reduxjs/toolkit';

const initialState = 
  localStorage.getItem('post') ? JSON.parse(localStorage.getItem('post')) : { postItems: []}
;

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addToPosts: (state, action) => {
      state.postItems = action.payload;
      localStorage.setItem('post', JSON.stringify(state));
    },
    removePost: (state, action) => {
      const id = action.payload;
      const index = state.postItems.findIndex(post => post._id.toString() === id.toString());
      if (index !== -1) {
        state.postItems.splice(index, 1);
      }
      localStorage.setItem('post', JSON.stringify(state));
    },
    newPost: (state, action) => {
      state.postItems.push(action.payload);
      localStorage.setItem('post', JSON.stringify(state));
    },
    updatePost: (state, action) => {
      state.postItems = state.postItems.map(post => {
          if (post._id.toString() === action.payload._id.toString()) {
              // Return updated post
              return { ...post, ...action.payload };
          }
          // Return unchanged post
          return post;
      });
      localStorage.setItem('post', JSON.stringify(state)); // Store postItems in localStorage
  },
  
    deletePost:(state, action) => {
      state.postItems = [];
      localStorage.removeItem('post');   
  },
  addComment: (state, action) => {
    const { id: postId, comment, user } = action.payload; 

    state.postItems = state.postItems.map(post => {
        if (post._id.toString() === postId.toString()) {
            // Check if there is already a comment from the same user
            const existingCommentIndex = post.comments.findIndex(c => c.user._id.toString() === user._id.toString());
            console.log('existing', existingCommentIndex);

            if (existingCommentIndex !== -1) {
                // Replace the existing comment
                post.comments[existingCommentIndex] = comment;
            } else {
                // Add the new comment
                post.comments = [...post.comments, comment];
            }
        }
        // Ensure to return the post whether it's updated or not
        return post;
    });

    localStorage.setItem('post', JSON.stringify(state));
},
deleteComment: (state, action) => {
  const { id: postId, commentId:user } = action.payload;
  console.log('postId', action.payload);
  const updatedPosts = state.postItems.map(post => {
    if (post._id.toString() === postId.toString()) {
      const existingCommentIndex = post.comments.findIndex(c => c._id.toString() === user.toString());
      console.log('existing', existingCommentIndex);
      if(existingCommentIndex !== -1) {
        post.comments.splice(existingCommentIndex, 1);
      }
    }
    return post;
  });

  // Update state with the new postItems array
  state.postItems = updatedPosts;

  localStorage.setItem('post', JSON.stringify(state));
},

}
});

export const { addToPosts, removePost, newPost, updatePost, deletePost, addComment, deleteComment } = postSlice.actions;
export default postSlice.reducer;