import axios from 'axios';
import { useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import FormContainer from "../components/FormContainer"
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UpdatePasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(search);
  const message = searchParams.get('message');
  const err = searchParams.get('err');
  const id = searchParams.get('id');
  const BASE_URL = '/api/users';
  

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  useEffect(() => {
    if (err) {
      toast.error(err);
    }
  }, [err]);

  //submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/updatepassword/${id}`, { password, confirmPassword });
      console.log(res.data.message);
      toast.success(res.data.message);
      navigate('/login');
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  }

  
  
  return (
    <>
      
      <FormContainer>
        {loading && <Loader />}
          <h2 className="text-center mt-3">Update Password</h2>
          <Form className="m-3" onSubmit={handleSubmit}>
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
          <Form.Group className="my-2" controlId="confirmpassword">
            <Form.Label className='fw-bold'> Confirm Password</Form.Label>
            <div className='position-relative'>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
                 <Button
        className='position-absolute bg-transparent border-0 p-0'
        style={{
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      >
        {showConfirmPassword ? (
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
              Reset password
            </Button>
            
          </Form>
      
      </FormContainer>
    </>
  );
};

export default UpdatePasswordScreen;
