import React from 'react';

const LoginForm = ({
  username,
  password,
  handleLogin,
  onChangeUsername,
  onChangePassword
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={onChangeUsername}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={onChangePassword}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
