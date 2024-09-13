import React from 'react';
import styled from 'styled-components';

const Button = styled.a`
  position: absolute;
  top: 24px;
  right: 5%;
  z-index: 900;
  line-height: 1.5;
  height: 3rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  color: #000000;
  background-color: #FD0;
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  letter-spacing: 0.4px;
  font-weight: 800;
  box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5);
  transition: 0.3s all linear;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 1rem; /* Smaller font size on mobile */
    padding: 0.3rem 0.6rem; /* Reduced padding for mobile */
    right: 2%; /* Adjusted right position */
    top: 16px; /* Adjusted top position */
    height: 2.5rem; /* Reduced height */
  }

  &:hover, &:active, &:focus {
    text-decoration: none;
    box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
    opacity: 0.85;
    color: #818589;
  }
`;

const Image = styled.img`
  height: 20px;
  width: 21px;
  margin-bottom: 1px;
  box-shadow: none;
  border: none;
  vertical-align: middle;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    height: 18px;
    width: 19px; /* Slightly reduced icon size for mobile */
  }
`;

const Text = styled.span`
  margin-left: 10px;
  font-size: 1.2rem;
  vertical-align: middle;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 1rem; /* Smaller text size for mobile */
    margin-left: 8px; /* Adjusted margin for better spacing */
  }
`;

const BuyMeACoffeeButton = () => {
  return (
    <Button target="_blank" href="https://www.buymeacoffee.com/nic003">
      <Image src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" />
      <Text>Buy me a coffee</Text>
    </Button>
  );
};

export default BuyMeACoffeeButton;