import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ButtonGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #fde68a, #f59e0b);
  border-radius: 9999px;
  filter: blur(4px);
`;

const StyledButton = styled.button`
  position: relative;
  border-radius: 9999px;
  background: linear-gradient(to right, #fde68a, #f59e0b);
  color: #4b5563;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  transition: all 0.3s;
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 1rem; /* Smaller font size on mobile */
    padding: 0.5rem 1.5rem; /* Reduced padding for mobile */
  }

  &:hover {
    color: #374151;
    background: linear-gradient(to right, #fcd34d, #d97706);
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 10;
`;

function Button({ onClick }) {
  return (
    <ButtonContainer>
      <ButtonGradient />
      <StyledButton onClick={onClick}>
        <ButtonText>Search Area</ButtonText>
      </StyledButton>
    </ButtonContainer>
  );
}

export default Button;