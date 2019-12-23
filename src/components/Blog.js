import React, { useState } from 'react';
import BlogInfo from './BlogInfo';

const Blog = ({ blog, likeHandler }) => {
  const [displayInfo, setDisplayInfo] = useState(false);
  const handleTitleClick = evt => {
    setDisplayInfo(!displayInfo);
  };

  const displayStyle = { display: displayInfo ? 'block' : 'none' };
  return (
    <li className="blogListing">
      <div onClick={handleTitleClick}>
        {blog.title} written by {blog.author}
      </div>
      <BlogInfo style={displayStyle} blog={blog} likeHandler={likeHandler} />
    </li>
  );
};

export default Blog;
