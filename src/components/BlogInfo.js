import React from 'react';

const BlogInfo = ({ style, blog }) => {
  const addedBy = blog.user ? blog.user.name || blog.user.username : 'Admin';
  return (
    <div style={style} className="blogInfo">
      <p>{blog.url}</p>
      <p>
        {blog.likes} likes <button>like</button>
      </p>
      <p>
        added by <span>{addedBy}</span>
      </p>
    </div>
  );
};

export default BlogInfo;
