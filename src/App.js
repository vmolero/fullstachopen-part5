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
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [toast, setToast] = useState({ type: '', text: '' });

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
      setBlogs([]);
      showToast('Successfully logged out');
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  const handleCreateBlog = async event => {
    event.preventDefault();
    try {
      await blogService.create({ author, title, url }, user.token);
      await getBlogList(user);
      setAuthor('');
      setTitle('');
      setUrl('');
      showToast(`Blog entry ${title} by ${author} created successfully`);
    } catch (err) {
      showToast(`Failed to create ${title} by ${author}`, 'error');
    }
  };

  const handleLike = blogId => async event => {
    event.preventDefault();
    try {
      const positionInArray = findBlogPositionWithId(blogId, blogs);
      const [blogToUpdate, blogsCopy] = extractElementAt(
        positionInArray,
        blogs
      );
      const newLikesValue = blogToUpdate.likes + 1;
      const updatedBlog = await blogService.update(
        { ...blogToUpdate, likes: newLikesValue },
        user.token
      );
      updatedBlog.user = blogToUpdate.user;
      insertElementAt(positionInArray, blogsCopy, updatedBlog);
      sortByLikes(blogsCopy);
      setBlogs(blogsCopy);
      showToast(
        `Blog ${blogToUpdate.title} written by ${blogToUpdate.author} liked!`
      );
    } catch (err) {
      showToast('Failed to update blog', 'error');
    }
  };

  const handleDelete = blogId => async event => {
    event.preventDefault();
    const positionInArray = findBlogPositionWithId(blogId, blogs);
    const [blogToDelete, blogsCopy] = extractElementAt(positionInArray, blogs);
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`
      )
    ) {
      try {
        await blogService.delete(blogToDelete, user.token);
        setBlogs(blogsCopy);
        showToast(`Blog entry ${blogToDelete.title} deleted`);
      } catch (err) {
        showToast('Failed to delete blog', 'error');
      }
    }
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
        <LoginForm handleLogin={handleLogin} />
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
          <BlogList
            user={user}
            blogs={blogs}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        </>
      )}
    </>
  );
};

export default App;
