import React, { useState, useEffect, useCallback } from 'react';
import loginService from './services/loginService';
import blogService from './services/blogService';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import BlogList from './components/BlogList';
import CreateBlogForm from './components/CreateBlogForm';
import Toast from './components/Toast';
import Togglable from './components/Toggable';
import { useResource } from './hooks';

import './App.css';

function findBlogWithId(blogId, blogs) {
  let positionInArray = -1,
    found = false,
    end = false;

  do {
    positionInArray += 1;
    found = blogs[positionInArray].id === blogId;
    end = positionInArray === blogs.length - 1;
  } while (!found && !end);

  return blogs[positionInArray];
}

function sortByLikes(blogsCopy) {
  blogsCopy.sort((blogA, blogB) =>
    parseInt(blogA.likes) > parseInt(blogB.likes) ? -1 : 1
  );
}

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, blogResource] = useResource('/api/blogs');
  const [renderBlogs, setRenderBlogs] = useState([]);
  const [toast, setToast] = useState({ type: '', text: '' });

  const showToast = (text, type = 'success') => {
    setToast({ type, text });
    setTimeout(() => {
      setToast({ type: '', text: '' });
    }, 5000);
  };

  const handleLogin = ({ username, password }) => async event => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      if (!('token' in loggedUser)) {
        throw new Error('Token not found');
      }
      setUser(loggedUser);
      window.localStorage.setItem('login', JSON.stringify(loggedUser));
      showToast('Successfully logged in as ' + username);
      await getBlogList(loggedUser);
    } catch (err) {
      showToast('Failed to log in', 'error');
    }
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem('login');
      setUser(null);
      showToast('Successfully logged out');
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  const handleCreateBlog = ({ author, title, url }) => async event => {
    event.preventDefault();
    try {
      await blogResource.create({ author, title, url }, user.token);
      showToast(`Blog entry ${title} by ${author} created successfully`);
    } catch (err) {
      showToast(`Failed to create ${title} by ${author}`, 'error');
    }
  };

  const handleLike = blogId => async event => {
    event.preventDefault();
    try {
      const blogToUpdate = findBlogWithId(blogId, blogs);
      const newLikesValue = blogToUpdate.likes + 1;
      await blogResource.update(
        { ...blogToUpdate, likes: newLikesValue },
        user.token
      );

      showToast(
        `Blog ${blogToUpdate.title} written by ${blogToUpdate.author} liked!`
      );
    } catch (err) {
      showToast('Failed to update blog', 'error');
    }
  };

  const handleDelete = blogId => async event => {
    event.preventDefault();
    const blogToDelete = findBlogWithId(blogId, blogs);
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`
      )
    ) {
      try {
        await blogService.delete(blogToDelete, user.token);
        await getBlogList(user);
        showToast(`Blog entry ${blogToDelete.title} deleted`);
      } catch (err) {
        showToast('Failed to delete blog', 'error');
      }
    }
  };

  useEffect(() => {
    sortByLikes(blogs);
    setRenderBlogs(blogs);
  }, [blogs]);

  const stableBlogResource = useCallback(blogResource, []);
  const getBlogList = useCallback(
    async user => {
      try {
        await stableBlogResource.getAll(user.token);
      } catch (err) {
        showToast('Failed to get the list of blogs', 'error');
      }
    },
    [stableBlogResource]
  );
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('login');
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON);
      setUser(savedUser);
      getBlogList(savedUser);
    }
  }, [getBlogList]);

  return (
    <>
      <h1>Blogs</h1>
      <Toast type={toast.type} message={toast.text} />
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <>
          <Logout username={user.username} handleLogout={handleLogout} />
          <Togglable buttonLabel={'Create new'}>
            <CreateBlogForm handleCreateBlog={handleCreateBlog} />
          </Togglable>
          <BlogList
            user={user}
            blogs={renderBlogs}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        </>
      )}
    </>
  );
};

export default App;
