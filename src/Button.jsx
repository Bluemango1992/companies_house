import React from "react";
import './Button.css'; // Import the CSS file

function Button({ onClick }) {
  return (
    <div className="button-container">
      <div className="button-gradient"></div>
      <button onClick={onClick} className="button">
        <span>Search Area</span>
      </button>
    </div>
  );
}

export default Button;
