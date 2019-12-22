import React from 'react';
import Blog from './Blog';

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>List</h2>
      <ul>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
