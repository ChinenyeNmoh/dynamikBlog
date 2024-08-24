import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { FaArrowLeft, FaComment } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';

const ProfileScreen = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState({}); // Track which posts are expanded
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { postItems } = useSelector(state => state.post);
    const BASE_URL = '/api/posts';
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const limit = 2;

    //fetch data from local storage or server
    useEffect(() => {
        if(postItems.length === 0){
            const fetchPosts = async () => {
                try {
                    setLoading(true);
                    const res = await axios.get(`${BASE_URL}/${id}`);
                    const fetchedPosts = res?.data?.posts;
                    setPosts(fetchedPosts);
                    setLoading(false);
                } catch (error) {
                    console.error(error?.response?.data?.message);
                    setError(error?.response?.data?.message);
                    setLoading(false);
                }
            };
            fetchPosts();
        } else {
            setPosts(postItems.filter(post => post.author._id === userInfo._id));
            setLoading(false);

        }

    }, [postItems, userInfo._id]);

    
   
                             
    // Handle page change during pagination
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const toggleContent = (index) => {
        setExpandedPosts(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    // Paginate posts
    const indexOfLastPost = page * limit;
    const indexOfFirstPost = indexOfLastPost - limit;
    const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div>
            <Meta title="Profile" />
            <Button
                className='btn btn-light mt-3 rounded bg-primary text-white'
                onClick={() => navigate(-1)} // Corrected navigate function
            >
                <FaArrowLeft /> Go Back
            </Button>

            <Row className='mt-5'>
                <Col md={8}>
                    <h2 className='text-center'> Posts</h2>
                    {loading && <Loader />}
                    {error && <Message variant='danger'>{error}</Message>}
                    {!loading && currentPosts.length === 0 && (
                        <Message variant='info'>No posts found.</Message>
                    )}
                    {currentPosts.map((post, index) => {
                        const isExpanded = expandedPosts[post._id];
                        const content = isExpanded ? post.content : post.content.slice(0, 50) + '...';
                        return (
                            <div key={post._id}>
                                <Card className='mb-3'>
                                    <Card.Header className='fw-bold text-primary mt-3'>{post.title}</Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            {content}
                                            {post.content.length > 50 && (
                                                <button
                                                    className="btn btn-link"
                                                    onClick={() => toggleContent(post._id)}
                                                >
                                                    {isExpanded ? 'Less' : 'More'}
                                                </button>
                                            )}
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
                            </div>
                        );
                    })}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header className='fs-2 fw-bold text-center text-danger'>Author's Info</Card.Header>
                        <Card.Body>
                            <Card.Text><span className='fw-bold'>Name:</span> {' '}{userInfo?.name}</Card.Text>
                            <Card.Text><span className='fw-bold'>Email:</span> {' '}{userInfo?.email}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {posts?.length > limit && (
                <Paginate
                    total={Math.ceil(posts.length / limit)}
                    active={page}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ProfileScreen;
