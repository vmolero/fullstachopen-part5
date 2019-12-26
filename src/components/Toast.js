import React from 'react';

const Toast = ({ type, message }) => {
  let visible = '';

  if (message.length === 0) {
    visible = 'hidden';
  }

  const toastClasses = ['toast', type, visible].join(' ');
  return (
    <div className={toastClasses}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
