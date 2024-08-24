import { useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import FormContainer from "../components/FormContainer"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_URL = '/api/users';
 
  const navigate = useNavigate();


  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(false);
    }
  };
//submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/forgotpassword`, { email });
      console.log(res.data);
        toast.success(res.data.message);
        navigate('/');
        
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error?.response?.data?.message);
    } 
    setLoading(false);
  };
  return (
    <>
    
      <FormContainer>
       {loading && <Loader />}
          <h2 className="text-center mt-3">Forgot Password</h2>

          <Form className="m-3" onSubmit={handleSubmit}>
            <Form.Group className="my-2" controlId="email">
               
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={emailChangeHandler}
              />
               <Form.Text className={`text-danger ${emailError ? 'd-block' : 'd-none'}`}> Email is required</Form.Text>
            </Form.Group>
            <Button
              
              type="submit"
              variant="primary"
              className="d-block me-auto ms-auto mt-4"
            >
              Send
            </Button>
            
          </Form>
      
      </FormContainer>
    </>
  );
};

export default ForgotPasswordScreen;
