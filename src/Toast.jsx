import React from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  visibility: hidden;
  width: 400px;
  max-width: 90%;
  margin-bottom: 20px;
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  opacity: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  /* Show the toast when 'show' prop is true */
  ${({ show }) => show && `
    visibility: visible;
    opacity: 1;
  `}

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const ToastMessage = styled.span`
  flex: 1;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
  margin-right: 15px;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 12px;
    margin-right: 10px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const Toast = ({ message, show, onClose }) => {
  return (
    <ToastContainer show={show}>
      <ToastMessage>{message}</ToastMessage>
      <CloseButton onClick={onClose}>×</CloseButton>
    </ToastContainer>
  );
};

export default Toast;
