import React from 'react';

const BlogInfo = ({ style, blog, likeHandler }) => {
  const addedBy = blog.user ? blog.user.name || blog.user.username : 'Admin';
  return (
    <div style={style} className="blogInfo">
      <p>{blog.url}</p>
      <p>
        {blog.likes} likes <button onClick={likeHandler}>like</button>
      </p>
      <p>
        added by <span>{addedBy}</span>
      </p>
    </div>
  );
};

export default BlogInfo;
