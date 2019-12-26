import React from 'react';
import { useField } from '../hooks';

const LoginForm = ({ handleLogin }) => {
  const usernameInput = useField('text');
  const passwordInput = useField('password');
  return (
    <form
      onSubmit={handleLogin({
        username: usernameInput.value,
        password: passwordInput.value
      })}
    >
      <div>
        username
        <input name="Username" {...usernameInput} />
      </div>
      <div>
        password
        <input name="Password" {...passwordInput} />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
