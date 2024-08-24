import { Alert } from 'react-bootstrap';

const Message = ({ variant='info', children }) => {
  return <Alert 
  variant={variant}
  className='w-50'
  >
    {children}
  
  </Alert>;
};


export default Message;