import React from 'react';
import Comment from './Comment';
import { Container } from 'react-bootstrap';

const CommentList = ({ comments }) => {
    
    return (
        <>
            {comments?.length > 0 ? (
                comments.map((comment, index) => (
                    <Comment key={index} comment={comment} />
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </>
    );
};

export default CommentList;
