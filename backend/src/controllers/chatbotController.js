import Chatbot from '../models/Chatbot.js';
import cloudinary from '../config/cloudinary.js';
import { uploadImageToImgBB, uploadImageToCloudinary } from '../utils/imageUpload.js';

// Helper function to extract public ID from Cloudinary URL
function extractPublicIdFromUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/');
  const folderAndFile = parts.slice(-2).join('/');
  return folderAndFile.split('.')[0]; // Remove file extension
}

export const createChatbot = async (req, res) => {
  try {
    const chatbotData = { ...req.body, userId: req.userId };
    if (!chatbotData.botId) {
      chatbotData.botId = Date.now().toString() + Math.random().toString(36).slice(2, 11);
    }
    
    // Handle file uploads
    if (req.files) {
      const files = {};
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'chatbot-files'
        });
        files[file.originalname] = result.secure_url;
      }
      chatbotData.files = files;
    }

    // Handle image uploads (avatar, icon) - only process if they're base64 (not already uploaded)
    if (req.body.avatarUrl && req.body.avatarUrl.startsWith('data:')) {
      try {
        console.log('Uploading avatar to ImgBB...');
        chatbotData.avatarUrl = await uploadImageToImgBB(req.body.avatarUrl);
      } catch (error) {
        console.error('Avatar upload failed:', error);
        // Fallback to Cloudinary if ImgBB fails
        try {
          chatbotData.avatarUrl = await uploadImageToCloudinary(req.body.avatarUrl, 'chatbot-avatars');
        } catch (fallbackError) {
          console.error('Fallback avatar upload failed:', fallbackError);
        }
      }
    }
    // If avatarUrl is already a URL (from frontend upload), keep it as is
    else if (req.body.avatarUrl && req.body.avatarUrl.startsWith('http')) {
      console.log('Avatar already uploaded:', req.body.avatarUrl);
    }

    if (req.body.icon && req.body.icon.startsWith('data:')) {
      try {
        console.log('Uploading icon to ImgBB...');
        chatbotData.icon = await uploadImageToImgBB(req.body.icon);
      } catch (error) {
        console.error('Icon upload failed:', error);
        // Fallback to Cloudinary if ImgBB fails
        try {
          chatbotData.icon = await uploadImageToCloudinary(req.body.icon, 'chatbot-icons');
        } catch (fallbackError) {
          console.error('Fallback icon upload failed:', fallbackError);
        }
      }
    }
    // If icon is already a URL (from frontend upload), keep it as is
    else if (req.body.icon && req.body.icon.startsWith('http')) {
      console.log('Icon already uploaded:', req.body.icon);
    }

    // Handle images array (base64 list with description)
    if (req.body.images) {
      try {
        const images = Array.isArray(req.body.images) ? req.body.images : JSON.parse(req.body.images);
        console.log(`Processing ${images.length} images for chatbot creation`);
        const uploadedImages = [];
        for (const img of images) {
          try {
            console.log(`Uploading image: ${img.description || 'No description'}`);
            const url = await uploadImageToImgBB(img.dataUrl || img);
            uploadedImages.push({ 
              description: img.description || '', 
              url: url
            });
          } catch (error) {
            console.error('Knowledge image upload failed:', error);
            // Fallback to Cloudinary
            try {
              console.log('Trying Cloudinary fallback...');
              const fallbackUrl = await uploadImageToCloudinary(img.dataUrl || img, 'chatbot-knowledge-images');
              uploadedImages.push({ 
                description: img.description || '', 
                url: fallbackUrl,
                publicId: extractPublicIdFromUrl(fallbackUrl)
              });
            } catch (fallbackError) {
              console.error('Fallback knowledge image upload failed:', fallbackError);
            }
          }
        }
        chatbotData.images = uploadedImages;
        console.log(`Final images array:`, uploadedImages);
      } catch (e) {
        console.error('Images processing failed:', e);
      }
    }

    const chatbot = new Chatbot(chatbotData);
    await chatbot.save();

    res.status(201).json({ chatbot, id: chatbot._id, botId: chatbot.botId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chatbot', details: error.message });
  }
};

export const getChatbots = async (req, res) => {
  try {
    const chatbots = await Chatbot.find({ userId: req.userId });
    res.json({ chatbots });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chatbots' });
  }
};

export const getChatbotById = async (req, res) => {
  try {
    const chatbot = await Chatbot.findById(req.params.id);
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found' });
    }
    res.json({ chatbot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chatbot' });
  }
};

export const updateChatbot = async (req, res) => {
  try {
    const chatbotData = { ...req.body };
    
    // Handle image uploads (avatar, icon) - only process if they're base64 (not already uploaded)
    if (req.body.avatarUrl && req.body.avatarUrl.startsWith('data:')) {
      try {
        console.log('Uploading avatar to ImgBB...');
        chatbotData.avatarUrl = await uploadImageToImgBB(req.body.avatarUrl);
      } catch (error) {
        console.error('Avatar upload failed:', error);
        // Fallback to Cloudinary if ImgBB fails
        try {
          chatbotData.avatarUrl = await uploadImageToCloudinary(req.body.avatarUrl, 'chatbot-avatars');
        } catch (fallbackError) {
          console.error('Fallback avatar upload failed:', fallbackError);
        }
      }
    }
    // If avatarUrl is already a URL (from frontend upload), keep it as is
    else if (req.body.avatarUrl && req.body.avatarUrl.startsWith('http')) {
      console.log('Avatar already uploaded:', req.body.avatarUrl);
    }

    if (req.body.icon && req.body.icon.startsWith('data:')) {
      try {
        console.log('Uploading icon to ImgBB...');
        chatbotData.icon = await uploadImageToImgBB(req.body.icon);
      } catch (error) {
        console.error('Icon upload failed:', error);
        // Fallback to Cloudinary if ImgBB fails
        try {
          chatbotData.icon = await uploadImageToCloudinary(req.body.icon, 'chatbot-icons');
        } catch (fallbackError) {
          console.error('Fallback icon upload failed:', fallbackError);
        }
      }
    }
    // If icon is already a URL (from frontend upload), keep it as is
    else if (req.body.icon && req.body.icon.startsWith('http')) {
      console.log('Icon already uploaded:', req.body.icon);
    }

    // Handle images array (base64 list with description)
    if (req.body.images) {
      try {
        const images = Array.isArray(req.body.images) ? req.body.images : JSON.parse(req.body.images);
        console.log(`Processing ${images.length} images for chatbot update`);
        const uploadedImages = [];
        for (const img of images) {
          // If image already has a URL (from previous upload), keep it
          if (img.url && !img.dataUrl) {
            console.log(`Keeping existing image: ${img.url}`);
            uploadedImages.push(img);
          } else {
            // Upload new image
            try {
              console.log(`Uploading new image: ${img.description || 'No description'}`);
              const url = await uploadImageToImgBB(img.dataUrl || img);
              uploadedImages.push({ 
                description: img.description || '', 
                url: url
              });
            } catch (error) {
              console.error('Knowledge image upload failed:', error);
              // Fallback to Cloudinary
              try {
                console.log('Trying Cloudinary fallback...');
                const fallbackUrl = await uploadImageToCloudinary(img.dataUrl || img, 'chatbot-knowledge-images');
                uploadedImages.push({ 
                  description: img.description || '', 
                  url: fallbackUrl,
                  publicId: extractPublicIdFromUrl(fallbackUrl)
                });
              } catch (fallbackError) {
                console.error('Fallback knowledge image upload failed:', fallbackError);
              }
            }
          }
        }
        chatbotData.images = uploadedImages;
        console.log(`Final images array for update:`, uploadedImages);
      } catch (e) {
        console.error('Images processing failed:', e);
      }
    }

    const chatbot = await Chatbot.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...chatbotData, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found' });
    }
    
    res.json({ chatbot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chatbot' });
  }
};

export const getChatbotByBotId = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({ botId: req.params.botId });
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found' });
    }
    res.json({ chatbot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chatbot' });
  }
};

// Test endpoint to verify image upload functionality
export const testImageUpload = async (req, res) => {
  try {
    const { base64Image, description } = req.body;
    
    if (!base64Image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Testing image upload to ImgBB...');
    const url = await uploadImageToImgBB(base64Image);
    
    res.json({ 
      success: true, 
      url: url,
      description: description || 'Test image',
      message: 'Image uploaded successfully to ImgBB'
    });
  } catch (error) {
    console.error('Test image upload failed:', error);
    res.status(500).json({ 
      error: 'Image upload failed', 
      details: error.message 
    });
  }
};

export const deleteChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!chatbot) {
      return res.status(404).json({ error: 'Chatbot not found' });
    }
    
    res.json({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chatbot' });
  }
};


