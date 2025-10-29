import mongoose from 'mongoose';

const chatbotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  botId: { type: String, unique: true },
  name: { type: String, required: true },
  description: String,
  behavior: String,
  knowledge: String,
  details: String,
  images: [{ description: String, url: String, publicId: String }],
  links: [{ url: String, description: String }],
  
  // Contact Information
  contact: {
    email: String,
    phone: String,
    website: String,
    socialMedia: [{ platform: String, url: String }]
  },
  
  // Appearance
  avatarUrl: String,
  placeholder: { type: String, default: 'Type your message...' },
  headerColor: { type: String, default: '#3B82F6' },
  headerSize: { type: Number, default: 60 },
  chatbotSizeX: { type: Number, default: 400 },
  chatbotSizeY: { type: Number, default: 600 },
  iconSize: { type: Number, default: 60 },
  
  // Colors
  foregroundColor: { type: String, default: '#FFFFFF' },
  backgroundColor: { type: String, default: '#F3F4F6' },
  userChatColor: { type: String, default: '#3B82F6' },
  botChatColor: { type: String, default: '#E5E7EB' },
  userTextColor: { type: String, default: '#FFFFFF' },
  botTextColor: { type: String, default: '#111827' },
  
  // Settings
  faqs: [{ question: String, answer: String }],
  audioInput: { type: Boolean, default: false },
  desktop: { type: Boolean, default: true },
  mobile: { type: Boolean, default: true },
  autoOpen: { type: Boolean, default: false },
  welcomeMessage: { type: String, default: 'Hi! How can I help you today?' },
  
  // Icons
  icon: String,
  iconLabel: String,
  iconColor: { type: String, default: '#FFFFFF' },
  
  // Files
  files: { type: Map, of: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chatbot', chatbotSchema);


