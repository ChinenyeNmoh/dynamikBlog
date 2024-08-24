import { Container, Image, Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import SearchBox from './SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCredentials } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { deletePost } from '../slices/postSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const BASE_URL = '/api/users';

  const handleLogout = async () => {
    try {
     
      setLogoutLoading(true);
      const res = await axios.get(`${BASE_URL}/logout`);
      console.log(res.data);
      dispatch(deleteCredentials())
      dispatch(deletePost());
      
      window.location.href = '/'; 
    } catch (error) {
      console.error('Logout failed:', error.response.data.message);
      toast.error(error.response.data.message);
    }
    setLogoutLoading(false);
  };


  const linkClass = ({ isActive }) =>
    isActive ? "bg-primary text-white rounded px-3 py-2 text-decoration-none me-3" : "text-white rounded-md px-3 py-2  text-decoration-none";


  return (
    <>
    <Navbar 
    expand="md" 
    bg='dark' 
    variant='dark'
    className="fw-bold" 
    collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className='pt-3'>
          <Image src="logo2.png" className="logo" alt="" /> DynamiK Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto mt-3">
            {userInfo ? (
              <>
                <NavLink to={`/Profile/${userInfo._id}`} className={linkClass}>
                    Profile
                </NavLink>

                <NavLink to="/createpost" className={linkClass}>
              Add Posts
            </NavLink>
                <Nav.Item className="ms-3">
                <Button
                      className="bg-transparent border-0 text-white fw-bold"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </Nav.Item>
              </>
            ) : (
              <>
               <NavLink to="/register" className={linkClass}>
               Sign Up
              </NavLink>
              <NavLink to="/login" className={linkClass}>
               Sign In
              </NavLink>
              </>
            )}
           
            
          </Nav>
          <SearchBox />
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {logoutLoading && <Loader />}
    </>
  );
}

export default Header;
