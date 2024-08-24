import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../slices/postSlice';
import axios from 'axios';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Comment = ({ comment }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Added navigate function
    const [loading, setLoading] = useState(false);
    const { userInfo } = useSelector(state => state.auth);
    const [showDelete, setShowDelete] = useState(false);
    const id = comment?.post;
    const commentId = comment?._id;
    const user = comment?.user?._id;

    useEffect(() => {
        if (user === userInfo?._id) {
            setShowDelete(true);
        } else {
            setShowDelete(false);
        }
    }, [userInfo, user]); 

    // Delete comment
    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`/api/comments/${commentId}`);
            console.log(res.data);
            console.log(user)
            
            dispatch(deleteComment({ id, commentId }));
            toast.success('Comment deleted successfully')
        } catch (error) {
            console.error(error.message);
            toast.error(error?.response?.data?.message || error.message || 'Failed to delete comment');
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = new Date(comment.createdAt).toLocaleDateString();

    return (
        <Card className="my-3">
            <Card.Body>
                
                <Card.Text>{comment.comment}</Card.Text>
                <div className='d-flex gap-2 align-items-center'>
                    <Card.Subtitle className="text-muted">{formattedDate}</Card.Subtitle>
                    
                    {loading && <Loader />}
                    {showDelete && (
                        <Button
                            className="text-danger bg-transparent outline-none border-0"
                            onClick={handleDelete}
                        >
                            <MdDelete className="text-danger fs-5 mb-1" />
                        </Button>
                    )}
                   
                </div>
                <Card.Subtitle  className='mt-1'>{comment?.user?.name}</Card.Subtitle>
            </Card.Body>
        </Card>
    );
};

export default Comment;
