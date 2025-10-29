// Test script to verify all image upload functionality
import dotenv from 'dotenv';
import { uploadImageToImgBB } from './src/utils/imageUpload.js';

// Load environment variables
dotenv.config();

// Test images (1x1 pixel PNG in base64)
const testAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const testIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const testKnowledgeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testAllUploads() {
  try {
    // Check if ImgBB API key is set
    if (!process.env.IMGBB_API_KEY) {
      console.error('❌ IMGBB_API_KEY not found in environment variables');
      console.log('Please set IMGBB_API_KEY in your .env file');
      console.log('Get your API key from: https://api.imgbb.com/');
      return;
    }

    console.log('🧪 Testing all image upload types...\n');

    // Test avatar upload
    console.log('1️⃣ Testing avatar upload...');
    const avatarUrl = await uploadImageToImgBB(testAvatar);
    console.log('✅ Avatar uploaded:', avatarUrl);

    // Test icon upload
    console.log('\n2️⃣ Testing icon upload...');
    const iconUrl = await uploadImageToImgBB(testIcon);
    console.log('✅ Icon uploaded:', iconUrl);

    // Test knowledge image upload
    console.log('\n3️⃣ Testing knowledge image upload...');
    const knowledgeUrl = await uploadImageToImgBB(testKnowledgeImage);
    console.log('✅ Knowledge image uploaded:', knowledgeUrl);

    console.log('\n🎉 All image uploads successful!');
    console.log('\n📋 Summary:');
    console.log(`Avatar URL: ${avatarUrl}`);
    console.log(`Icon URL: ${iconUrl}`);
    console.log(`Knowledge Image URL: ${knowledgeUrl}`);

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

testAllUploads();
