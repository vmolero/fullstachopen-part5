import React from 'react';

const Toast = ({ type, message }) => {
  if (message.length === 0) {
    return null;
  }

  const toastClasses = `${type} toast`;
  return <div className={toastClasses}>{message}</div>;
};

export default Toast;
