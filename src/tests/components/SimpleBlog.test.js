import React from 'react';
import '../setupTests';
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

test('button click calls handler', () => {
  const blog = {
    title: 'Learning React.',
    author: 'Victor Molero',
    url: 'http://learning-react.com',
    likes: 7
  };

  const mockHandler = jest.fn();

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  );

  const button = getByText('like');
  fireEvent.click(button);
  fireEvent.click(button);

  expect(mockHandler.mock.calls.length).toBe(2);
});
