import React from 'react';
import Blog from './Blog';

const BlogList = ({ user, blogs, handleLike, handleDelete }) => {
  return (
    <div>
      <h2>List</h2>
      <ul className="blogListings">
        {blogs.map(blog => (
          <Blog
            key={blog.id}
            user={user}
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
