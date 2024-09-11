import React from 'react';
import styled from 'styled-components';

const Button = styled.a`
  position: absolute;
  top: 24px;
  right: 5%;
  z-index: 1000;
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
  font-family: cursive;

  &:hover, &:active, &:focus {
    text-decoration: none;
    box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
    opacity: 0.85;
    color: #CCCCCC;
  }
`;

const Image = styled.img`
  height: 20px;
  width: 21px;
  margin-bottom: 1px;
  box-shadow: none;
  border: none;
  vertical-align: middle;
`;

const Text = styled.span`
  margin-left: 10px;
  font-size: 1.2rem;
  vertical-align: middle;
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