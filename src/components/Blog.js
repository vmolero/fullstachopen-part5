import React from 'react';
import BlogInfo from './BlogInfo';

const Blog = ({ blog, likeHandler }) => {
  const infoReference = React.createRef();

  const handleTitleClick = evt => {
    infoReference.current.toggleVisibility();
  };

  return (
    <li className="blogListing">
      <div onClick={handleTitleClick}>
        {blog.title} written by {blog.author}
      </div>
      <BlogInfo ref={infoReference} blog={blog} likeHandler={likeHandler} />
    </li>
  );
};

export default Blog;
