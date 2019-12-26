import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import App from '../App';
import './setupTests';

jest.mock('../services/blogService');

describe('<App />', () => {
  test('if no user logged, blogs are not rendered', async () => {
    const component = render(<App />);
    component.rerender(<App />);
    await waitForElement(() => component.getByText('login'));
    const formElement = component.container.querySelector('form');
    expect(formElement).toBeDefined();
    const blogListingDiv = component.container.querySelector('.blogListings');
    expect(blogListingDiv).toBe(null);
  });

  test('', async () => {
    const user = {
      username: 'tester',
      token: '1231231214',
      name: 'Donald Tester'
    };
    localStorage.setItem('login', JSON.stringify(user));
    const component = render(<App />);
    component.rerender(<App />);

    await waitForElement(() =>
      component.container.querySelector('.blogListing')
    );

    const blogListingLis = component.container.querySelectorAll('.blogListing');
    expect(blogListingLis.length).toBe(19);
  });
});
