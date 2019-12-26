import React from 'react';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import App from '../App';
import './setupTests';

jest.mock('../services/loginService');

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
});
