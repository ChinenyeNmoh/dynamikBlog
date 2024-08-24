import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
/*
This is the main layout just like the base file.
Outlet is every other page that will inherit from this main layout
since we want Navbar to be present in all the pages, we imported navbar and positioned it ontop
*/ 

function App() {
  
  return (
    <>
    <Header />  {/* Header is our custom header component */}
    <ToastContainer position="top-center" />
    <main className=''>
      <Container className='min'>
        <Outlet />
      </Container>
    </main>
    <Footer /> {/* Footer is our custom footer component */}
    
    
  </>
  )
}

export default App