import React, { useEffect } from 'react';
import './Toast.css'; // Import the CSS file

const Toast = ({ message, show, onClose }) => {

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
