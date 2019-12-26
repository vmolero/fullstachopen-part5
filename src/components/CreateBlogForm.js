import React from 'react';
import { useField } from '../hooks';

const CreateBlogForm = ({ handleCreateBlog }) => {
  const authorInput = useField('text');
  const titleInput = useField('text');
  const urlInput = useField('text');
  return (
    <>
      <h2>Create blog</h2>
      <form
        onSubmit={handleCreateBlog({
          author: authorInput.value,
          title: titleInput.value,
          url: urlInput.value
        })}
        onReset={evt => {
          evt.preventDefault();
          authorInput.onReset();
          titleInput.onReset();
          urlInput.onReset();
        }}
      >
        <div>
          author
          <input name="author" {...authorInput} />
        </div>
        <div>
          title
          <input name="title" {...titleInput} />
        </div>
        <div>
          url
          <input name="url" {...urlInput} />
        </div>
        <button type="submit">Create</button>
        <button type="reset">reset</button>
      </form>
    </>
  );
};

export default CreateBlogForm;
