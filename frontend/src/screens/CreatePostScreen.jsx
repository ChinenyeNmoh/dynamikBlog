import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { newPost } from '../slices/postSlice';
import Loader from '../components/Loader';
import { useDispatch} from 'react-redux';
import Meta from '../components/Meta';
import axios from 'axios';

const CreatePostScreen = () => {
  const [title, setTitle] = useState(''); //set state for every field in the form
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = '/api/posts';

 

  const submitHandler = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/create`, { title, content });
      toast.success(res?.data?.message);
      console.log('Post created', res.data.post);
    dispatch(newPost(res.data.post));
    navigate('/allposts');
    }catch(error){
      console.error(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
    
  };

  return (
    <>
    <Meta title="Create post" />
      {loading  && <Loader />}
        <h2 className="text-center mt-3">Add Post</h2>
        <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
        <Card className="my-5">
        <Form className="m-3" onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="title">
            <Form.Label className='fw-bold'>Title</Form.Label>
            <Form.Control
              type="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-2" controlId="content">
            <Form.Label className='fw-bold'>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write post"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          <Button
            disabled={loading}
            type="submit"
            variant="primary"
            className="d-block me-auto ms-auto mt-4"
          >
            Add
          </Button>
        </Form>
         
          </Card>
        </Col>
      </Row>
    </Container>
       

     
    </>
  );
};
export default CreatePostScreen;