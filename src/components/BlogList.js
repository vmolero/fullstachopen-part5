import React from 'react';
import Blog from './Blog';

const BlogList = ({ blogs, handleLike, handleDelete }) => {
  return (
    <div>
      <h2>List</h2>
      <ul className="blogListings">
        {blogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeHandler={handleLike(blog.id)}
            deleteHandler={handleDelete(blog.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
