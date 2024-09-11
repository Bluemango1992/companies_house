// FABButton.js
import React, { useState } from 'react';
import './FABButton.css';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

const FeedbackModal = ({ onClose , isOpen }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay active">
      <div className="modal">
        <div className="modal-header">
          <h1>Provide Feedback</h1>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>We value your input. Please share your thoughts with us.</p>
          <textarea placeholder="Type your feedback here."></textarea>
        </div>
        <div className="modal-footer">
          <button className="submit-button" onClick={onClose}>Submit Feedback</button>
        </div>
      </div>
    </div>
  );
};



const FABButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button className="fab-button" onClick={handleButtonClick}>
        <ChatBubbleIcon height={24} width={24} />
      </button>
  
      {isModalOpen && <FeedbackModal onClose={closeModal} isOpen={isModalOpen} />}
    </>
  );
};

export default FABButton;
