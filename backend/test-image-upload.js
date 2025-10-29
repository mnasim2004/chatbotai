// Test script to verify image upload functionality
import dotenv from 'dotenv';
import { uploadImageToImgBB } from './src/utils/imageUpload.js';

// Load environment variables
dotenv.config();

// Simple test image (1x1 pixel PNG in base64)
const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testUpload() {
  try {
    // Check if ImgBB API key is set
    if (!process.env.IMGBB_API_KEY) {
      console.error('❌ IMGBB_API_KEY not found in environment variables');
      console.log('Please set IMGBB_API_KEY in your .env file');
      console.log('Get your API key from: https://api.imgbb.com/');
      return;
    }

    console.log('Testing ImgBB image upload...');
    console.log('API Key:', process.env.IMGBB_API_KEY.substring(0, 8) + '...');
    const url = await uploadImageToImgBB(testImage);
    console.log('✅ Success! Image uploaded to:', url);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

testUpload();
