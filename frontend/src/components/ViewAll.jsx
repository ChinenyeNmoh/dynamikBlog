import React from 'react';
import { Link } from 'react-router-dom';

const ViewAll = () => {
  return (
    <section className="d-flex justify-content-center mt-1 mb-3" >
        <Link to="/allposts" className="bg-dark text-white text-center p-2 px-6 rounded text-decoration-none">
          View All Posts
        </Link>
    </section>
  );
}

export default ViewAll;
