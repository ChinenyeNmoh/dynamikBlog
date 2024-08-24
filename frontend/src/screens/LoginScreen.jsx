import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import FormContainer from "../components/FormContainer"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';


const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const BASE_URL = '/api/users';
  
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';
  const message = searchParams.get('message');
  const error = searchParams.get('error');



  
  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);


  // Handle login and store user data in the Redux store
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try{
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
      toast.success(res?.data?.message);
      dispatch(setCredentials(res?.data?.user));
      navigate(redirect);

    }catch(error){
      console.error(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
    setLoginLoading(false);
    
  }
  return (
    <>
      <FormContainer>
        {loginLoading && <Loader />}
        <h2 className="text-center mt-3">Sign In</h2>
        <Form className="m-3" onSubmit={handleLogin}>
          <Form.Group className="my-2" controlId="email">
            <Form.Label className='fw-bold'>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label className='fw-bold'>Password</Form.Label>
            <div className='position-relative'>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
                 <Button
        className='position-absolute bg-transparent border-0 p-0'
        style={{
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <FaEye className='text-black' />
        ) : (
          <FaEyeSlash className='text-black' />
        )}
      </Button>

            </div>
            
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="d-block me-auto ms-auto mt-4"
          >
            Sign In
          </Button>
          
        </Form>

        <Row className="py-3 m-3 ">
          <Col md={6}>
            New Customer?{' '}
            <Link to="/register">
              Register
            </Link>
          </Col>

          <Col md={6}>
            <Link to="/forgotpassword" className="text-muted">
              Forgot password?
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginScreen;