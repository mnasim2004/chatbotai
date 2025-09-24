import React, { useState } from 'react';

interface LogoDropdownProps {
  onLogoChange: (logo: string) => void;
  preview: string | null;
  setPreview: (e: string) => void;
}

const SendDropdown: React.FC<LogoDropdownProps> = ({ onLogoChange,preview, setPreview }) => {
  // Handle change event for dropdown
  const [selectedLogo, setSelectedLogo] = useState("")
  const logos = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrEkJfb8W-3LQiFulznB53ninrl79yFQ-QRQ&s","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQKxFy5A5a6Z4Vq2IsCsb1VO0i-yO5yvuTxw&s","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn3zwqzHwgRkVT2NZe20ovhyJMnOX9W1s4hg&s"]
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLogoChange(event.target.value);
    setPreview(event.target.value)
    setSelectedLogo(event.target.value)
  };
  

  return (
    <>
    <div className="relative">
      <select
        id="logo-select"
        value={selectedLogo}
        onChange={handleSelectChange}
        style={{backgroundColor:"hsl(var(--greyish))", borderColor:"hsl(var(--greyish-border))"}}
        className="block w-full mt-1 mb-3 h-[40px] px-2 border-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {logos.map((logo, index) => (
          <option key={index} value={logo}>
            {logo}
          </option>
        ))}
      </select>
    </div>
    <div className="image-upload flex flex-col content-space-evenly" >
    {preview && (
        <div>
        <img
            src={preview}
            alt="Selected"
            className="mb-4 max-w-full rounded-full"
            width={70}
            height={70}
        />
        </div>
    )}
</div>
</>
  );
};

export default SendDropdown;
