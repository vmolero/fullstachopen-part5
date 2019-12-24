import React, { useState, useImperativeHandle } from 'react';

const BlogInfo = React.forwardRef(
  ({ user, blog, likeHandler, deleteHandler }, ref) => {
    const addedBy = blog.user ? blog.user.name || blog.user.username : 'Admin';
    const addedByUsername = blog.user ? blog.user.username : 'admin';
    const canDelete =
      addedByUsername === user.username || addedByUsername === 'admin';
    const [visible, setVisible] = useState(false);
    const toggleVisibility = evt => {
      setVisible(!visible);
    };

    useImperativeHandle(ref, () => {
      return {
        toggleVisibility
      };
    });

    const displayStyle = { display: visible ? 'block' : 'none' };
    return (
      <div style={displayStyle} className="blogInfo">
        <p>{blog.url}</p>
        <p>
          {blog.likes} likes <button onClick={likeHandler}>like</button>
        </p>
        <p>
          added by <span>{addedBy}</span>
        </p>
        {canDelete ? <button onClick={deleteHandler}>delete</button> : null}
      </div>
    );
  }
);

export default BlogInfo;
