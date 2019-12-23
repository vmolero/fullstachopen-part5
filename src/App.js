import React, { useState, useEffect } from 'react';
import loginService from './services/loginService';
import blogService from './services/blogService';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import BlogList from './components/BlogList';
import CreateBlogForm from './components/CreateBlogForm';
import Toast from './components/Toast';
import Togglable from './components/Toggable';

import './App.css';

function findBlogPositionWithId(blogId, blogs) {
  let positionInArray = -1,
    found = false,
    end = false;

  do {
    positionInArray += 1;
    found = blogs[positionInArray].id === blogId;
    end = positionInArray === blogs.length - 1;
  } while (!found && !end);

  return positionInArray;
}

function extractElementAt(positionInArray, blogs) {
  let blogToUpdate = null;
  const blogsCopy = blogs.map(blog => blog);
  if (positionInArray > -1) {
    blogToUpdate = blogsCopy.splice(positionInArray, 1).pop();
  }

  return [blogToUpdate, blogsCopy];
}

function insertElementAt(positionInArray, blogsCopy, updatedBlog) {
  blogsCopy.splice(positionInArray, 0, updatedBlog);
}

function sortByLikes(blogsCopy) {
  blogsCopy.sort((blogA, blogB) =>
    parseInt(blogA.likes) > parseInt(blogB.likes) ? -1 : 1
  );
}

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [toast, setToast] = useState({ type: '', text: '' });

  const onChangeUsername = ({ target }) => setUsername(target.value);
  const onChangePassword = ({ target }) => setPassword(target.value);
  const onChangeAuthor = ({ target }) => setAuthor(target.value);
  const onChangeTitle = ({ target }) => setTitle(target.value);
  const onChangeUrl = ({ target }) => setUrl(target.value);

  const showToast = (text, type = 'success') => {
    setToast({ type, text });
    setTimeout(() => {
      setToast({ type: '', text: '' });
    }, 5000);
  };

  const getBlogList = async user => {
    try {
      const blogList = await blogService.getAll(user.token);
      sortByLikes(blogList);
      setBlogs(blogList);
    } catch (err) {
      showToast('Failed to get the list of blogs', 'error');
    }
  };

  const handleLogin = async event => {
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
      setBlogs([]);
      showToast('Successfully logged out');
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  const handleCreateBlog = async event => {
    event.preventDefault();
    await blogService.create({ author, title, url }, user.token);
    await getBlogList(user);
  };

  const handleLike = blogId => async event => {
    event.preventDefault();
    const positionInArray = findBlogPositionWithId(blogId, blogs);
    const [blogToUpdate, blogsCopy] = extractElementAt(positionInArray, blogs);
    blogToUpdate.likes += 1;
    const updatedBlog = await blogService.update(blogToUpdate, user.token);
    updatedBlog.user = blogToUpdate.user;
    insertElementAt(positionInArray, blogsCopy, updatedBlog);
    sortByLikes(blogsCopy);
    setBlogs(blogsCopy);
  };

  useEffect(() => {
    const getAllBlogs = async user => {
      const blogList = await blogService.getAll(user.token);
      sortByLikes(blogList);
      setBlogs(blogList);
    };
    const loggedUserJSON = window.localStorage.getItem('login');
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON);
      setUser(savedUser);
      getAllBlogs(savedUser);
    }
  }, []);

  return (
    <>
      <h1>Blogs</h1>
      <Toast type={toast.type} message={toast.text} />
      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          onChangeUsername={onChangeUsername}
          onChangePassword={onChangePassword}
        />
      ) : (
        <>
          <Logout username={user.username} handleLogout={handleLogout} />
          <Togglable buttonLabel={'Create new'}>
            <CreateBlogForm
              author={author}
              title={title}
              url={url}
              onChangeAuthor={onChangeAuthor}
              onChangeTitle={onChangeTitle}
              onChangeUrl={onChangeUrl}
              handleCreateBlog={handleCreateBlog}
            />
          </Togglable>
          <BlogList blogs={blogs} handleLike={handleLike} />
        </>
      )}
    </>
  );
};

export default App;
