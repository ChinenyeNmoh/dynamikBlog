import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Post from './Post';
import Message from './Message';
import { Row, Button } from 'react-bootstrap';
import Paginate from './Paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify';
import { addToPosts } from '../slices/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const PostList = ({ isHome = false }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate(); // Added navigate function
    const BASE_URL = '/api/posts';
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 9;

    // Get the search keyword from the URL
    const query = new URLSearchParams(location.search);
    const keyword = query.get('keyword');

    // Retrieve posts from Redux state
    const { postItems } = useSelector((state) => state.post);
    const [posts, setPosts] = useState(postItems);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (!postItems || postItems.length === 0) {
                    setLoading(true);
                    const res = await axios.get(`${BASE_URL}/`);
                    const fetchedPosts = res?.data?.posts;
                    dispatch(addToPosts(fetchedPosts));
                    setPosts(fetchedPosts);
                    setLoading(false);
                    
                } else {
                    console.log('Posts from local storgage');
                    setPosts(postItems);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error?.response?.data?.message);
                toast.error(error?.response?.data?.message);
                setLoading(false);
                
            }finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [postItems, dispatch]); // Added postItems and dispatch to dependency array

    // Handle page change during pagination
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    // Filter posts based on the search keyword
    const filteredPosts = keyword
        ? posts?.filter((post) =>
            post.title.toLowerCase().includes(keyword.toLowerCase()) ||
            post.content.toLowerCase().includes(keyword.toLowerCase())
        )
        : posts;

    const displayedPosts = isHome ? filteredPosts?.slice(0, 6) : filteredPosts;

    // Paginate posts
    const indexOfLastPost = page * limit;
    const indexOfFirstPost = indexOfLastPost - limit;
    const currentPosts = displayedPosts?.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <section>
            {loading && <Loader />}
            <div>
                <Button
                    className='btn btn-light mt-3 rounded bg-primary text-white'
                    onClick={() => navigate(-1)} // Corrected navigate function
                >
                    <FaArrowLeft /> Go Back
                </Button>
                <h3 className='fs-3 fw-bolder text-dark mb-6 text-center p-3'>
                    {isHome ? 'Recent Posts' : 'All Posts'}
                </h3>
            </div>
            <Row>
                {currentPosts?.map((post, index) => (
                    <Post key={index} post={post} />
                ))}
                {currentPosts?.length === 0 && !loading && <Message variant='danger'>No posts found</Message>}
            </Row>
            {!isHome && filteredPosts?.length > limit && (
                <Paginate
                    total={Math.ceil(filteredPosts?.length / limit)}
                    active={page}
                    onPageChange={handlePageChange}
                />
            )}
        </section>
    );
};

export default PostList;
