// Primary image upload function using ImgBB
export async function uploadImageToImgBB(base64DataUrl) {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    throw new Error('IMGBB_API_KEY missing. Please set it in your .env file')
  }

  const body = new URLSearchParams()
  const base64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl
  body.append('image', base64)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body
  })
  
  const data = await res.json()
  if (data?.success) {
    console.log('✅ Image uploaded to ImgBB:', data.data.url)
    return data.data.url
  }
  
  throw new Error(`ImgBB upload failed: ${data?.error?.message || 'Unknown error'}`)
}

// Fallback function using Cloudinary
export async function uploadImageToCloudinary(base64DataUrl, folder = 'chatbot-images') {
  try {
    const result = await cloudinary.uploader.upload(base64DataUrl, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    });
    console.log('✅ Image uploaded to Cloudinary:', result.secure_url)
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
}
