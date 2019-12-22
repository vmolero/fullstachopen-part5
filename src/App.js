import React, { useState } from 'react';
import loginService from './services/loginService';
import blogService from './services/blogService';

const Blog = ({ blog }) => {
  return (
    <li>
      {blog.title} {blog.author}
    </li>
  );
};

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const handleLogin = async event => {
    event.preventDefault();
    const user = await loginService.login({ username, password });
    setUser(user);
    const blogs = await blogService.getAll(user.token);
    setBlogs(blogs);
  };

  if (user === null) {
    return (
      <div>
        <h1>Blogs</h1>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }
  return (
    <>
      <h1>Blogs</h1>
      <div>Logged in as {user.username}</div>
      <div>
        <h2>blogs</h2>
        <ul>
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
