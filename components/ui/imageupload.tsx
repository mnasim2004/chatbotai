// components/ImageUpload.tsx
import React, { useState } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  background-color: var(--card);
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: var(--popover);
    border-color: var(--card-foreground);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagePreview = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  width: 100%;
`;

const ImageItem = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius);
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  background-color: hsl(var(--input));
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: hsl(var(--popover));
    border-color: hsl(var(--card-foreground));
  }
`;

interface ImageUploadProps {
    onChange: (file: File | null) => void;
    label: string;
    imageurl?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, label, imageurl }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(imageurl ? imageurl : null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImagePreview(URL.createObjectURL(file));
        onChange(file);
      }
  };

  return (
    <Container>
      <Label htmlFor="image-upload">
        <span>{label}</span>
        <HiddenInput
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Label>
      {imagePreview && (
        <ImagePreview>
          <ImageItem src={imagePreview} alt="Image preview" />
        </ImagePreview>
      )}
    </Container>
  );
};

export default ImageUpload;
