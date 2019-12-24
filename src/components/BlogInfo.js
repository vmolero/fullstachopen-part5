import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const BlogInfo = React.forwardRef(
  (
    { likes, url, ownerUsername, username, likeHandler, deleteHandler },
    ref
  ) => {
    const canDelete = ownerUsername === username || ownerUsername === undefined;
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => {
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
        <p>
          <a href={url}>{url}</a>
        </p>
        <p>
          {likes} likes <button onClick={likeHandler}>like</button>
        </p>
        <p>
          added by <span>{ownerUsername}</span>
        </p>
        {canDelete ? <button onClick={deleteHandler}>delete</button> : null}
      </div>
    );
  }
);

BlogInfo.propTypes = {
  likes: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  ownerUsername: PropTypes.string,
  username: PropTypes.string.isRequired,
  likeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired
};

BlogInfo.displayName = 'BlogInfo';
export default BlogInfo;
