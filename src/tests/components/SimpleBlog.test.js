import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import SimpleBlog from '../../components/SimpleBlog';

test('renders content', () => {
  const blog = {
    title: 'Learning React.',
    author: 'Victor Molero',
    url: 'http://learning-react.com',
    likes: 7
  };

  const component = render(<SimpleBlog blog={blog} />);

  expect(component.container).toHaveTextContent(
    'Learning React. Victor Molero'
  );

  const div = component.container.querySelector('.info');
  expect(div).toHaveTextContent('blog has 7 likes');
});
