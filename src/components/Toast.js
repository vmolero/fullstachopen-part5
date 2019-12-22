import React from 'react';

const Toast = ({ type, message }) => {
  if (message.length === 0) {
    return null;
  }

  return <div className={type}>{message}</div>;
};

export default Toast;
