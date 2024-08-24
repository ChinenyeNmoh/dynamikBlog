import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();


  // Handle form submission and navigate to search results page or 
  // home page if keyword is empty or whitespace.
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/allposts?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form className="d-flex w-auto mt-4 ms-2" onSubmit={submitHandler}>
      <Form.Control
        type="search"
        placeholder="Search"
        className="me-1 search"
        aria-label="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button variant="link" className="" type="submit">
        <FaSearch className="fs-4 text-white" />
      </Button>
    </Form>
  );
};

export default SearchBox;
