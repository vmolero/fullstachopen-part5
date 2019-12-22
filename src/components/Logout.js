import React from 'react';

const Logout = ({ username, handleLogout }) => {
  return (
    <div>
      Logged in as {username}{' '}
      <button type="button" onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};

export default Logout;
