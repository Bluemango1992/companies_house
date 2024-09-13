import React, { useState } from 'react';
import styled from 'styled-components';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

const FabButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.1);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 95%;
    padding: 20px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ModalTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #333;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: #777;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 25px;
`;

const ModalText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #555;
  margin-bottom: 20px;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  font-size: 16px;
  line-height: 1.5;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ModalFooter = styled.div`
  text-align: right;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

const FeedbackModal = ({ onClose, isOpen }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setError('Feedback cannot be empty');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });
  
      if (response.ok) {
        setFeedback('');
        onClose();
      } else {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'An error occurred';
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Something went wrong. Please try again later.');
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay>
      <Modal>
        <ModalHeader>
          <ModalTitle>Provide Feedback</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <ModalText>We value your input. Please share your thoughts with us.</ModalText>
          <Textarea
            placeholder="Type your feedback here."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </ModalBody>
        <ModalFooter>
          <SubmitButton onClick={handleSubmit}>Submit Feedback</SubmitButton>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
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
      <FabButton onClick={handleButtonClick}>
        <ChatBubbleIcon width={30} height={30} />
      </FabButton>
      <FeedbackModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default FABButton;
