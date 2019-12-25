import React from 'react';
import BlogInfo from './BlogInfo';
import PropTypes from 'prop-types';

const Blog = ({ user, blog, likeHandler, deleteHandler }) => {
  const infoReference = React.createRef();

  const handleTitleClick = () => {
    infoReference.current.toggleVisibility();
  };

  return (
    <li className="blogListing">
      <div onClick={handleTitleClick} className="header">
        {blog.title} written by {blog.author || 'Anonymous'}
      </div>
      <BlogInfo
        ref={infoReference}
        username={user.username}
        likes={blog.likes}
        url={blog.url}
        ownerUsername={blog.user ? blog.user.username : undefined}
        likeHandler={likeHandler}
        deleteHandler={deleteHandler}
      />
    </li>
  );
};

Blog.propTypes = {
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired
  }),
  likeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired
};

export default Blog;
