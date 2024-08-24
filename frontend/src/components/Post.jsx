import { useState } from "react";
import { Card, Col } from "react-bootstrap";
import { FaComment } from "react-icons/fa";

import { Link } from "react-router-dom";

const Post = ({  post }) => {
    const [show, setShow] = useState(false);
    let content = post.content;
    if (!show && content.length > 50) {
        content = content.slice(0, 50) + '...';
    }

    return (
        <Col md={4} className="mb-4">
            <Card className="h-100 mx-3">
            <Card.Header className='fw-bold text-primary mt-3'>{post.title}</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {content}
                        <button
                        className=" btn btn-link"
                        onClick={() => setShow(prevState => !prevState)}
                    >
                        {content.length < 50 ? "" : show  ? 'Less' : 'More'}
                    </button>
                    </Card.Text>
                    <Link
                    to={`/post/${post._id}`}
                    className='text-white px-1 py-1 rounded text-center text-decoration-none bg-secondary'
                >
                    Read More
                </Link>
                    
                </Card.Body>
                <Card.Footer className='fw-bold text-muted d-flex justify-content-evenly'>
                    <p>{post?.author?.name}</p>
                    <Link
                     to={`/post/${post._id}`}
                    className="text-decoration-none text-danger"
                    >
                    <FaComment /> {post?.comments?.length}
                    </Link>
                    
                </Card.Footer>
            </Card>
        </Col>
    );
};

export default Post;
