import React, { useState, useEffect } from 'react';
import loginService from './services/loginService';
import blogService from './services/blogService';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import BlogList from './components/BlogList';
import CreateBlogForm from './components/CreateBlogForm';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const onChangeUsername = ({ target }) => setUsername(target.value);
  const onChangePassword = ({ target }) => setPassword(target.value);
  const onChangeAuthor = ({ target }) => setAuthor(target.value);
  const onChangeTitle = ({ target }) => setTitle(target.value);
  const onChangeUrl = ({ target }) => setUrl(target.value);

  const getBlogList = async user => {
    const blogs = await blogService.getAll(user.token);
    setBlogs(blogs);
  };

  const handleLogin = async event => {
    event.preventDefault();
    const user = await loginService.login({ username, password });
    if ('token' in user) {
      setUser(user);
      window.localStorage.setItem('login', JSON.stringify(user));
      await getBlogList(user);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('login');
    setUser(null);
    setBlogs([]);
  };

  const handleCreateBlog = async () => {
    await blogService.create({ author, title, url }, user.token);
    const blogs = await blogService.getAll(user.token);
    setBlogs(blogs);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('login');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      getBlogList(user);
    }
  }, []);

  return (
    <>
      <h1>Blogs</h1>
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
          <CreateBlogForm
            author={author}
            title={title}
            url={url}
            onChangeAuthor={onChangeAuthor}
            onChangeTitle={onChangeTitle}
            onChangeUrl={onChangeUrl}
            handleCreateBlog={handleCreateBlog}
          />
          <BlogList blogs={blogs} />
        </>
      )}
    </>
  );
};

export default App;
