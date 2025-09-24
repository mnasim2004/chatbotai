// ColorPicker.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface ColorPickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledColorInput = styled.input`
  width: 40px;
  margin: 10px;
  height: 40px;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  appearance: none;
  outline: none;
  background: hsl(var(--input));

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: var(--radius);
  }

  &::-webkit-color-input {
    border: none;
    border-radius: var(--radius);
  }
`;
const ColorPicker: React.FC<ColorPickerProps> = ({ onChange, value }) => {

  return (
    <StyledColorInput
      type="color"  
      onChange={onChange}
      value={value}
    />
  );
};

export default ColorPicker;
