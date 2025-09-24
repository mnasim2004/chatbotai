import React, { useState } from 'react';

interface LogoDropdownProps {
  onLogoChange: (logo: string) => void;
  onImageSelect: (logo: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
  setPreview: (e: string) => void;
}

const LogoDropdown: React.FC<LogoDropdownProps> = ({ onLogoChange, onImageSelect, preview, setPreview }) => {
  // Handle change event for dropdown
  const [selectedLogo, setSelectedLogo] = useState("")
  const logos = ["Other","https://miro.medium.com/v2/resize:fit:750/format:webp/1*C_LFPy6TagD1SEN5SwmVRQ.jpeg","https://mir-s3-cdn-cf.behance.net/projects/404/a42236171852785.Y3JvcCwxMzEzLDEwMjcsMTQzLDg3.png"]
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value!="Other"){
      onLogoChange(event.target.value);
      setPreview(event.target.value)
      setSelectedLogo(event.target.value)
    }
  };

  const UploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLogo("Other")
    
    onImageSelect(event)

    
  }
  

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
    <input
        type="file"
        name="icon"
        accept="image/*"
        onChange={UploadImage}
        className="mb-4" 
        style={{ color: "hsl(var(--greyish))"}}
    />
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

export default LogoDropdown;
