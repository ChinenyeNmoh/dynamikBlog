import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ total, active = 1, onPageChange }) => {
  const items = [];

  for (let number = 1; number <= total; number++) {
      items.push(
          <Pagination.Item
              key={number}
              active={number === active}
              onClick={() => onPageChange(number)}
          >
              {number}
          </Pagination.Item>
      );
  }

  return (
      <div>
          <Pagination>{items}</Pagination>
      </div>
  );
}

export default PaginationComponent;
