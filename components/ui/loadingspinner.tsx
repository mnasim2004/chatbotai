import React from 'react';
import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  pointer-events: all;
`;

const LoadingSpinner: React.FC = () => (
  <Overlay>
    <ClipLoader size={50} color={"#ffffff"} />
  </Overlay>
);

export default LoadingSpinner;
