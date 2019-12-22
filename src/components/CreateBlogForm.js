import React from 'react';

const CreateBlogForm = ({
  author,
  title,
  url,
  handleCreateBlog,
  onChangeAuthor,
  onChangeTitle,
  onChangeUrl
}) => {
  return (
    <>
      <h2>Create blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          author
          <input
            type="text"
            value={author}
            name="author"
            onChange={onChangeAuthor}
          />
        </div>
        <div>
          title
          <input
            type="text"
            value={title}
            name="title"
            onChange={onChangeTitle}
          />
        </div>
        <div>
          url
          <input type="text" value={url} name="url" onChange={onChangeUrl} />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  );
};

export default CreateBlogForm;
