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
      const blogs = await blogService.getAll(user.token);
      setBlogs(blogs);
    } catch (err) {
      showToast('Failed to get the list of blogs', 'error');
    }
  };

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      if (!('token' in user)) {
        throw new Error('Token not found');
      }
      setUser(user);
      window.localStorage.setItem('login', JSON.stringify(user));
      showToast('Successfully logged in as ' + username);
      await getBlogList(user);
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
    const blogToUpdate = blogs.filter(blog => blog.id === blogId).pop();
    const restOfBlogs = blogs.filter(blog => blog.id !== blogId);
    blogToUpdate.likes += 1;
    const updatedBlog = await blogService.update(blogToUpdate, user.token);
    const allBlogs = restOfBlogs.concat([updatedBlog]);
    setBlogs(allBlogs);
  };

  useEffect(() => {
    const getAllBlogs = async user => {
      const blogs = await blogService.getAll(user.token);
      setBlogs(blogs);
    };
    const loggedUserJSON = window.localStorage.getItem('login');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      getAllBlogs(user);
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
