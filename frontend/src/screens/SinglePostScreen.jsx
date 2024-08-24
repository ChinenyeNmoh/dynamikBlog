import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { FaComment, FaEdit, FaArrowLeft } from "react-icons/fa";
import {  MdDelete } from "react-icons/md";
import { removePost, updatePost as updatePostAction, addComment } from '../slices/postSlice';
import { useSelector, useDispatch } from 'react-redux';
import Meta from '../components/Meta';
import CommentList from '../components/CommentList';
import axios from 'axios';

const SinglePostScreen = () => {
  const { id } = useParams();
 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = '/api/posts';
  const [postLoading, setPostLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const { postItems } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [content, setContent] = useState('');
  const [post, setPost] = useState(null);
 const [postComments, setPostComments] = useState([]);
 const [canEdit, setCanEdit] = useState(false);

 // Modal functions
  const handleClose = () => setShow(false);
  const handleShow = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setComment(post.comment);
    setShow(true);
  };


  // Fetch post from the server or from the Redux store
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPostLoading(true);
        let fetchedPost;
        if (postItems.length === 0) {
          const res = await axios.get(`/api/posts/${id}`);
          fetchedPost = res.data.post;
         
        } else {
          fetchedPost = await postItems.find(post => post._id.toString() === id.toString());
          setPostLoading(false);
        }
        setPost(fetchedPost);
        setPostComments(fetchedPost?.comments);
        setPostLoading(false);
      } catch (error) {
        console.error(error?.response?.data?.message);
        toast.error(error?.response?.data?.message || error.message || 'Failed to fetch post');
      } 
    };
    fetchPost();
  }, [ postItems, id, userInfo]);


  

  
// Delete post handler
  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        setDeleteLoading(true);
        await axios.delete(`${BASE_URL}/${id}`);
        dispatch(removePost(id));
        toast.success("Post deleted successfully");
        navigate('/allposts');
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || 'Failed to delete post');
      } finally {
        setDeleteLoading(false);
      }
    }
  };


  // Edit post handler
  const editPostHandler = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') {
      toast.error('Title and content cannot be empty');
      return;
    }
    try {
      setUpdateLoading(true);
      const res = await axios.put(`${BASE_URL}/${id}`, { id, title, content });
      dispatch(updatePostAction(res.data.post ));
      toast.success("Post updated successfully");
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update post');
    } finally {
      setUpdateLoading(false);
    }
  };


  // Add comment handler
  const addCommentHandler = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      setCommentLoading(true);
      const res = await axios.post(`/api/comments/${id}/create`, { comment, id });
      const newComment = res.data.comment;
      const user = res.data.comment.user;
      console.log('user', user);
      // Dispatch the action to update the Redux store
      dispatch(addComment({ id, comment: newComment, user }));
      setComment(''); // Clear the comment input
      toast.success(res.data.message);
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.response?.data?.message || error.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };


  // Check if the user can edit the post
  useEffect(() => {
    if(userInfo && postComments){
      setCanEdit(postComments.find(c => c.user._id === userInfo._id));
    }
  }, [userInfo, postComments]);

  

  return (
    <div>
      {postLoading && <Loader />}
      <Meta title={post?.title} description={post?.content} />
      <Button
        className='btn btn-light my-5 rounded bg-primary text-white'
        onClick={() => navigate('/allposts')}
      >
        <FaArrowLeft /> Go Back
      </Button>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header className='fw-bold text-primary text-center'>{post?.title}</Card.Header>
            <Card.Body>
              <Card.Text>{post?.content}</Card.Text>
              <Card.Text><span className='fw-bolder'>Posted by:</span> {post?.author?.name}</Card.Text>
              <Card.Text> <FaComment className='text-danger'/> {post?.comments?.length}</Card.Text>
              <CommentList comments={postComments}/>
              
            </Card.Body>
            {userInfo?._id === post?.author?._id && (
              <Card.Footer className='d-flex justify-content-center'>
                {updateLoading && <Loader />}
                {deleteLoading && <Loader />}
                {commentLoading && <Loader />}
                <Button
                  type='button'
                  className='btn-block bg-transparent btn btn-link fs-3 text-success'
                  onClick={() => handleShow(post)}
                  disabled={updateLoading || deleteLoading}
                >
                  <FaEdit />
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Body>
                    <Form onSubmit={editPostHandler}>
                      <Form.Group className="my-2" controlId="title">
                        <Form.Label className="fw-bold">Title</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder="Enter title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="my-2" controlId="content">
                        <Form.Label className="fw-bold">Content</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          placeholder="Write post"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                      </Form.Group>
                      <Modal.Footer>
                        <Button variant="outline-primary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button variant="outline-secondary" type="submit">
                          Update
                        </Button>
                      </Modal.Footer>
                    </Form>
                  </Modal.Body>
                </Modal>
                <Button
                  type='button'
                  className='btn-block bg-transparent fs-3 btn btn-link text-danger'
                  onClick={deleteHandler}
                  disabled={updateLoading || deleteLoading}
                >
                  <MdDelete />
                </Button>
              </Card.Footer>
            )}
          </Card>
          
          <Form onSubmit={addCommentHandler} className="mt-3">
            {!userInfo ? (
               <p className='text-center fw-bold fs-5'>Login to add a comment</p>
            ) : canEdit ? (
              <p className='text-center fw-bold fs-5'>Edit comment</p>
            ) : (
              <p className='text-center fw-bold fs-5'>Add comment</p>
            )}
           
                <Form.Group controlId="comment">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here"
                  />
                </Form.Group>
                <Button 
                variant="primary" 
                type="submit"
                disabled={!userInfo || !comment}
                className="mt-2 mb-5 d-block ms-auto me-auto"
                >
                  Submit
                </Button>
              </Form>
        </Col>
        <Col md={4}>
          <Card  className='mb-3'>
            <Card.Header className='fs-2 fw-bold text-center text-danger'>Author's Info</Card.Header>
            <Card.Body>

                  <Card.Text ><span className='fw-bold '>Name:</span> {' '} {post?.author?.name}</Card.Text>
                <Card.Text ><span className='fw-bold '>Email:</span> {' '} {post?.author?.email}</Card.Text>
                
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SinglePostScreen;
