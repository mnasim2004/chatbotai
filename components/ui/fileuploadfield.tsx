// FileUpload.tsx
import React, { useState } from 'react';
import { styled } from "styled-components";

interface FileUploadProps {
  onChange: (files: File[]) => void;
  isMultiple?: boolean;
  label: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  background-color: hsl(var(--card));
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: hsl(var(--popover));
    border-color: hsl(var(--card-foreground));
  }
`;

const StyledInput = styled.input`
  display: none;
`;

const FileList = styled.ul`
  margin-top: 1rem;
  list-style-type: none;
  padding: 0;
  width: 100%;
`;

const FileItem = styled.li`
  background-color: hsl(var(--greyish));
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  text-wrap: wrap;
`;

const FileUpload: React.FC<FileUploadProps> = ({ onChange, label, isMultiple=false }) => {
    const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
      onChange(newFiles);
    }
  };
  return (
    <Container style={{maxWidth:"100%", backgroundColor:"hsl(var(--greyish-border))"}}>
      <label htmlFor="file-upload" style={{ cursor: 'pointer', backgroundColor:"hsl(var(--greyish-border))" }}>
        <span>{label}</span>
        <StyledInput
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          multiple={isMultiple}
        />
      </label>
      {files.length > 0 && (
        <FileList>
          {files.map((file, index) => (
            <FileItem key={index}>
              {file.name}
            </FileItem>
          ))}
        </FileList>
      )}
    </Container>
  );
};

export default FileUpload;
