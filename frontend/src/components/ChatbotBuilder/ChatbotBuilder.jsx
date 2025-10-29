import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatbotAPI } from '../../utils/api';
import { ArrowLeft, Save, Eye, Download, Loader, Check, Bot, Palette, Settings, MessageCircle, MessageSquare, Send, Sparkles, Star, Headphones, HelpCircle, Smile } from 'lucide-react';
import ChatbotPreview from './ChatbotPreview';
import { useToast } from '../Toast/ToastProvider.jsx';
import './builder-slider.css';

export default function ChatbotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  
  // Inline form states
  const [showAddImageForm, setShowAddImageForm] = useState(false);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [showAddSocialForm, setShowAddSocialForm] = useState(false);
  
  // Form data states
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImageDescription, setNewImageDescription] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [showAddFaqForm, setShowAddFaqForm] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  
  // Toast helper
  const showNotificationMessage = (message, type = 'success') => {
    const map = {
      success: (m) => toast.success(m),
      error: (m) => toast.error(m),
      warning: (m) => toast.warning(m),
      info: (m) => toast.info(m)
    };
    (map[type] || map.success)(message);
  };
  const [showEmbed, setShowEmbed] = useState(false);
  const [createdBotId, setCreatedBotId] = useState(null); // Store the created bot's ID
  const [step, setStep] = useState(1);
  const avatarPresets = [
    'https://i.pravatar.cc/100?img=3',
    'https://i.pravatar.cc/100?img=5',
    'https://i.pravatar.cc/100?img=7',
    'https://i.pravatar.cc/100?img=10',
    'https://i.pravatar.cc/100?img=12',
    'https://i.pravatar.cc/100?img=15'
  ];
  const iconPresets = [
    { name: 'Bot', component: Bot },
    { name: 'Message Circle', component: MessageCircle },
    { name: 'Message Square', component: MessageSquare },
    { name: 'Send', component: Send },
    { name: 'Sparkles', component: Sparkles },
    { name: 'Star', component: Star },
    { name: 'Headphones', component: Headphones },
    { name: 'Help Circle', component: HelpCircle },
    { name: 'Smile', component: Smile }
  ];
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    behavior: '',
    knowledge: '',
    details: '',
    avatarUrl: 'https://i.pravatar.cc/100?img=3',
    placeholder: 'Type your message...',
    headerColor: '#3B82F6',
    headerSize: 60,
    chatbotSizeX: 400,
    chatbotSizeY: 600,
    iconSize: 60,
    foregroundColor: '#FFFFFF',
    backgroundColor: '#F3F4F6',
    userChatColor: '#3B82F6',
    botChatColor: '#E5E7EB',
    userTextColor: '#FFFFFF',
    botTextColor: '#111827',
    audioInput: false,
    desktop: true,
    mobile: true,
    autoOpen: false,
    welcomeMessage: 'Hi! How can I help you today?',
    icon: 'bot',
    iconLabel: '',
    images: [],
    links: [],
    faqs: [],
    contact: {
      email: '',
      phone: '',
      website: '',
      socialMedia: []
    },
  });

  useEffect(() => {
    if (id) {
      fetchChatbot();
    }
  }, [id]);

  

  const fetchChatbot = async () => {
    try {
      const response = await chatbotAPI.getById(id);
      const bot = response.data.chatbot;
      setFormData({
        name: bot.name,
        description: bot.description || '',
        behavior: bot.behavior || '',
        knowledge: bot.knowledge || '',
        details: bot.details || '',
        avatarUrl: bot.avatarUrl || '',
        placeholder: bot.placeholder,
        headerColor: bot.headerColor,
        headerSize: bot.headerSize,
        chatbotSizeX: bot.chatbotSizeX,
        chatbotSizeY: bot.chatbotSizeY,
        iconSize: bot.iconSize,
        foregroundColor: bot.foregroundColor,
        backgroundColor: bot.backgroundColor,
        userChatColor: bot.userChatColor,
        botChatColor: bot.botChatColor,
        userTextColor: bot.userTextColor,
        botTextColor: bot.botTextColor,
        audioInput: bot.audioInput,
        desktop: bot.desktop,
        mobile: bot.mobile,
        autoOpen: bot.autoOpen,
        welcomeMessage: bot.welcomeMessage,
        icon: bot.icon || '',
        iconLabel: bot.iconLabel || '',
        images: bot.images || [],
        links: bot.links || [],
        faqs: bot.faqs || [],
        contact: {
          email: bot.contact?.email || '',
          phone: bot.contact?.phone || '',
          website: bot.contact?.website || '',
          socialMedia: bot.contact?.socialMedia || []
        },
      });
    } catch (error) {
      console.error('Failed to fetch chatbot:', error);
      showNotificationMessage('Failed to load chatbot', 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showNotificationMessage('Please enter a chatbot name', 'warning');
      return;
    }

    setSaving(true);
    try {
      let response;
      if (id) {
        response = await chatbotAPI.update(id, formData);
      } else {
        response = await chatbotAPI.create(formData);
      }
      
      showNotificationMessage(id ? 'Chatbot updated successfully!' : 'Chatbot created successfully! Open Settings to download the embed code.', 'success');
      
      if (!id) {
        const newId = response.data.chatbot._id;
        const botId = response.data.chatbot.botId || response.data.botId; // Get the botId
        setCreatedBotId(botId || newId); // Store the botId
        navigate(`/builder/${newId}`);
        // Use top-right toast instead of center modal
      }
    } catch (error) {
      console.error('Failed to save chatbot:', error);
      showNotificationMessage('Failed to save chatbot. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarIconUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 and upload to ImgBB immediately
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      
      // Show loading state
      setFormData({ ...formData, [field]: 'uploading...' });
      
      try {
        // Upload to ImgBB via backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chatbots/test-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base64Image: base64Data,
            description: `${field} image`
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Update with ImgBB URL
          setFormData({ ...formData, [field]: data.url });
          console.log(`✅ ${field} uploaded to ImgBB:`, data.url);
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        console.error(`❌ ${field} upload failed:`, error);
        // Fallback to base64 for now
        setFormData({ ...formData, [field]: base64Data });
        showNotificationMessage(`Failed to upload ${field}. Using local preview.`, 'warning');
      }
    };
    reader.readAsDataURL(file);
  };

  const addImage = () => {
    setShowAddImageForm(true);
  };

  const handleImageSubmit = async () => {
    if (!newImageFile || !newImageDescription.trim()) return;

    // Add loading state
    const loadingImage = { description: newImageDescription, dataUrl: 'uploading...', url: null };
    setFormData({
      ...formData,
      images: [...formData.images, loadingImage]
    });
      
      const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // Upload to ImgBB via backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chatbots/test-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base64Image: reader.result,
            description: newImageDescription
          })
        });

        const data = await response.json();

        if (data.success) {
          // Update with ImgBB URL
          const uploadedImage = { description: newImageDescription, url: data.url };
          setFormData({
            ...formData,
            images: [...formData.images.filter(img => img !== loadingImage), uploadedImage]
          });
          console.log(`✅ Knowledge image uploaded to ImgBB:`, data.url);
          showNotificationMessage('Image uploaded successfully!', 'success');
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        console.error(`❌ Knowledge image upload failed:`, error);
        // Fallback to base64
        const fallbackImage = { description: newImageDescription, dataUrl: reader.result };
        setFormData({
          ...formData,
          images: [...formData.images.filter(img => img !== loadingImage), fallbackImage]
        });
        showNotificationMessage('Image uploaded locally (upload service unavailable)', 'warning');
      }
    };
    reader.readAsDataURL(newImageFile);
    
    // Reset form
    setNewImageFile(null);
    setNewImageDescription('');
    setShowAddImageForm(false);
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }]
    });
  };

  const updateFaq = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const removeFaq = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index)
    });
  };

  const handleFaqSubmit = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    setFormData({
      ...formData,
      faqs: [...(formData.faqs || []), { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }]
    });
    setShowAddFaqForm(false);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const addLink = () => {
    setShowAddLinkForm(true);
  };

  const handleLinkSubmit = () => {
    if (!newLinkUrl.trim() || !newLinkDescription.trim()) return;

    setFormData({
      ...formData,
      links: [...formData.links, { url: newLinkUrl.trim(), description: newLinkDescription.trim() }]
    });
    showNotificationMessage('Link added successfully!', 'success');
    
    // Reset form
    setNewLinkUrl('');
    setNewLinkDescription('');
    setShowAddLinkForm(false);
  };

  const removeLink = (index) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index)
    });
  };

  const addSocialMedia = () => {
    setShowAddSocialForm(true);
  };

  const handleSocialSubmit = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;

    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        socialMedia: [...formData.contact.socialMedia, { platform: newSocialPlatform.trim(), url: newSocialUrl.trim() }]
      }
    });
    showNotificationMessage('Social media link added successfully!', 'success');
    
    // Reset form
    setNewSocialPlatform('');
    setNewSocialUrl('');
    setShowAddSocialForm(false);
  };

  const removeSocialMedia = (index) => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        socialMedia: formData.contact.socialMedia.filter((_, i) => i !== index)
      }
    });
  };

  

  const downloadEmbedCode = () => {
    const embedCode = `// Download the ChatBot component
// curl -o botembed.tsx https://raw.githubusercontent.com/mnasim2004/chatbotai/main/components/botembed.tsx

import ChatBot from "./botembed";

export default function App() {
  return (
    <div>
      <ChatBot botId="${createdBotId || id}" />
    </div>
  );
}`;

    const blob = new Blob([embedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-integration.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="builder-slider-root animate-fadeInUp">
      <div className="builder-content animate-scaleIn">
        <div className="form-stack">
          <form>
            {/* Basic Information */}
            {step === 1 && (
            <div className="form-section">
              <h3><Bot size={20} /> Basic Information</h3>
              <div className="form-group">
                <label>Chatbot Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Customer Support Bot" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="A helpful assistant for customer inquiries" />
              </div>
              <div className="form-group">
                <label>Behavior Guidelines</label>
                <textarea value={formData.behavior} onChange={(e) => setFormData({ ...formData, behavior: e.target.value })} rows={3} placeholder="Be friendly, professional, and concise..." />
              </div>
              <div className="form-group">
                <label>Knowledge Base</label>
                <textarea value={formData.knowledge} onChange={(e) => setFormData({ ...formData, knowledge: e.target.value })} rows={4} placeholder="Our business hours are 9 AM - 5 PM..." />
              </div>
              <div className="form-group">
                <label>Additional Details</label>
                <textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} rows={3} placeholder="Company policies, product info, etc." />
              </div>
              <div className="form-group">
                <label>Welcome Message</label>
                <textarea 
                  value={formData.welcomeMessage} 
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })} 
                  placeholder="Hi! How can I help you today?" 
                  rows={3}
                  style={{ resize: 'vertical', minHeight: '60px' }}
                />
                <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Tip: Press Enter to create new lines. Each line will be displayed separately in the chatbot.
                </small>
              </div>
            </div>
            )}

            {/* Images & FAQ */}
            {step === 2 && (
            <div className="form-section">
              <h3>Knowledge Assets</h3>
              <div className="form-group">
                <label>Images</label>
                {!showAddImageForm ? (
                <button type="button" onClick={addImage} className="ghost">+ Add Image</button>
                ) : (
                    <div className="space-y-3 p-4 bg-gray-50  rounded-lg">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-gray-700">Select image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewImageFile(e.target.files[0])}
                            className="hidden"
                            id="new-image-upload"
                          />
                          <label
                            htmlFor="new-image-upload"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full cursor-pointer shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                            aria-label="Choose image file"
                          >
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 19h16" />
                            </svg>
                            Choose file
                          </label>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 truncate">
                          {newImageFile ? newImageFile.name : 'No file selected'}
                        </div>
                      </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newImageDescription}
                        onChange={(e) => setNewImageDescription(e.target.value)}
                        placeholder="Short description..."
                        className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={2}
                      />
                    </div>

                      <div className="flex gap-6 pt-3 justify-center">
                      <button
                        type="button"
                        onClick={handleImageSubmit}
                        disabled={!newImageFile || !newImageDescription.trim()}
                          className="px-3 py-1.5 text-[11px] font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddImageForm(false); setNewImageFile(null); setNewImageDescription(''); }}
                          className="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 shadow-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <small className="text-gray-500 text-xs mt-2 block">
                  Images will be uploaded and can be referenced by the AI in conversations.
                </small>
                {formData.images.map((img, index) => (
                  <div key={index} className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                    {img.dataUrl === 'uploading...' ? (
                      <div className="ui-icon-box ui-icon-box--gray">⏳</div>
                    ) : (
                      <img 
                        src={img.dataUrl || img.url} 
                        alt="" 
                        className="ui-thumb"
                      />
                    )}
                    <div style={{ flex: 1, fontSize: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{img.description}</div>
                      {img.dataUrl === 'uploading...' && (
                        <div style={{ color: '#f59e0b', fontSize: '10px' }}>
                          ⏳ Uploading...
                        </div>
                      )}
                      {img.url && (
                        <div style={{ color: '#10b981', fontSize: '10px' }}>
                          ✅ Selected
                        </div>
                      )}
                      {img.dataUrl && img.dataUrl.startsWith('data:') && !img.url && (
                        <div style={{ color: '#10b981', fontSize: '10px' }}>
                          ✓ Ready for upload
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => removeImage(index)} className="ui-remove-btn">×</button>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>Links</label>
                {!showAddLinkForm ? (
                  <button type="button" onClick={addLink} className="ghost">+ Add Link</button> 
                ) : (
                  <div className="space-y-2 p-3 bg-white border border-gray-200 rounded-md">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newLinkDescription}
                        onChange={(e) => setNewLinkDescription(e.target.value)}
                        placeholder="Short description..."
                        className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleLinkSubmit}
                        disabled={!newLinkUrl.trim() || !newLinkDescription.trim()}
                        className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddLinkForm(false); setNewLinkUrl(''); setNewLinkDescription(''); }}
                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <small className="text-gray-500 text-xs mt-2 block">
                  Add useful links that the AI can reference and redirect users to.
                </small>
                {(formData.links || []).map((link, index) => (
                  <div key={index} className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                    <div className="ui-icon-box ui-icon-box--blue">🔗</div>
                    <div style={{ flex: 1, fontSize: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{link.description}</div>
                      <div style={{ color: '#666', fontSize: '10px', wordBreak: 'break-all' }}>{link.url}</div>
                    </div>
                    <button type="button" onClick={() => removeLink(index)} className="ui-remove-btn">×</button>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>FAQs</label>

                {!showAddFaqForm ? (
                  <button 
                    type="button" 
                    onClick={() => setShowAddFaqForm(true)} 
                    className="ghost"
                  >
                    + Add FAQ
                  </button>
                ) : (
                  <div className="space-y-2 p-3 bg-white border border-gray-200 rounded-md">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={newFaqQuestion}
                        onChange={(e) => setNewFaqQuestion(e.target.value)}
                        placeholder="Type your question..."
                        className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={newFaqAnswer}
                        onChange={(e) => setNewFaqAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        rows={2}
                        className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleFaqSubmit}
                        disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}
                        className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddFaqForm(false); setNewFaqQuestion(''); setNewFaqAnswer(''); }}
                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <small className="text-gray-500 text-xs mt-2 block">
                  Add frequently asked questions that the AI can use to answer user queries.
                </small>

                {(formData.faqs || []).map((faq, index) => (
                  <div key={index} className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                    <div className="ui-icon-box ui-icon-box--gray" aria-hidden>
                      <HelpCircle size={16} />
                    </div>
                    <div style={{ flex: 1, fontSize: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{faq.question}</div>
                      <div style={{ color: '#666', fontSize: '10px', lineHeight: 1.4 }}>{faq.answer}</div>
                    </div>
                    <button type="button" onClick={() => removeFaq(index)} className="ui-remove-btn">×</button>
                  </div>
                ))}

                {formData.faqs.length === 0 && (
                  <p className="text-xs text-gray-400 mt-2">No FAQs added yet.</p>
                )}
              </div>
            </div>
            )}

            {/* Contact Information */}
            {step === 2 && (
            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.contact.email} 
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })} 
                  placeholder="contact@example.com" 
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  value={formData.contact.phone} 
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })} 
                  placeholder="+1 (555) 123-4567" 
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="url" 
                  value={formData.contact.website} 
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, website: e.target.value } })} 
                  placeholder="https://example.com" 
                />
              </div>
              <div className="form-group">
                <label>Social Media</label>
                  {!showAddSocialForm ? (
                    <button type="button" onClick={addSocialMedia} className="ghost">+ Add Social Media</button> 
                  ) : (
                    <div className="space-y-2 p-3 bg-white border border-gray-200 rounded-md">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Platform</label>
                        <input
                          type="text"
                          value={newSocialPlatform}
                          onChange={(e) => setNewSocialPlatform(e.target.value)}
                          placeholder="Twitter, LinkedIn, Instagram, etc."
                          className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Profile URL</label>
                        <input
                          type="url"
                          value={newSocialUrl}
                          onChange={(e) => setNewSocialUrl(e.target.value)}
                          placeholder="https://twitter.com/username"
                          className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleSocialSubmit}
                          disabled={!newSocialPlatform.trim() || !newSocialUrl.trim()}
                          className="px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowAddSocialForm(false); setNewSocialPlatform(''); setNewSocialUrl(''); }}
                          className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                <small className="text-gray-500 text-xs mt-2 block">
                  Add social media profiles for users to connect with you.
                </small>
                {(formData.contact?.socialMedia || []).map((social, index) => (
                  <div key={index} className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                    <div className="ui-icon-box ui-icon-box--green">📱</div>
                    <div style={{ flex: 1, fontSize: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{social.platform}</div>
                      <div style={{ color: '#666', fontSize: '10px', wordBreak: 'break-all' }}>{social.url}</div>
                    </div>
                    <button type="button" onClick={() => removeSocialMedia(index)} className="ui-remove-btn">×</button>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Appearance */}
            {step === 3 && (
            <div className="form-section">
              <h3><Palette size={20} /> Appearance & Design</h3>
              <div className="form-group">
                <label>Avatar</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleAvatarIconUpload(e, 'avatarUrl')} 
                      className="hidden" 
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload" 
                      className="flex items-center justify-center w-full h-20 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 group"
                    >
                      <div className="text-center">
                        <div className="mx-auto w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Upload Avatar</p>
                      </div>
                    </label>
                  </div>
                  
                  {formData.avatarUrl === 'uploading...' && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100">
                      <Loader size={12} className="text-amber-700 animate-spin" />
                      <span className="text-[11px] font-medium text-amber-800">Uploading</span>
                    </div>
                  )}
                  
                  {formData.avatarUrl && formData.avatarUrl.startsWith('http') && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-100">
                      <Check size={12} className="text-green-700" />
                      <span className="text-[11px] font-medium text-green-800">Uploaded</span>
                    </div>
                  )}
                </div>
                <div className="preset-grid">
                  {['https://i.pravatar.cc/100?img=3','https://i.pravatar.cc/100?img=5','https://i.pravatar.cc/100?img=7','https://i.pravatar.cc/100?img=10','https://i.pravatar.cc/100?img=12','https://i.pravatar.cc/100?img=15'].map((src) => (
                    <div key={src} className={`preset-item ${formData.avatarUrl === src ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, avatarUrl: src })}>
                      <img src={src} alt="avatar" className="ui-avatar" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Icon</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleAvatarIconUpload(e, 'icon')} 
                      className="hidden" 
                      id="icon-upload"
                    />
                    <label 
                      htmlFor="icon-upload" 
                      className="flex items-center justify-center w-full h-20 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200 group"
                    >
                      <div className="text-center">
                        <div className="mx-auto w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                          </svg>
                        </div>
                        <p className="text-xs font-medium text-gray-600 group-hover:text-purple-600">Upload Icon</p>
                      </div>
                    </label>
                  </div>
                  
                  {formData.icon === 'uploading...' && (
                    <div className="flex items-center justify-center py-2 px-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <svg className="w-3 h-3 mr-2 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs font-medium text-amber-700">Uploading...</span>
                    </div>
                  )}
                  
                  {formData.icon && formData.icon.startsWith('http') && (
                    <div className="flex items-center justify-center py-2 px-3 bg-green-50 border border-green-200 rounded-lg">
                      <svg className="w-3 h-3 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium text-green-700">Uploaded</span>
                    </div>
                  )}
                </div>
                <div className="preset-grid">
                  {iconPresets.map((iconPreset) => {
                    const IconComponent = iconPreset.component;
                    return (
                      <div 
                        key={iconPreset.name} 
                        className={`preset-item ${formData.icon === iconPreset.name.toLowerCase().replace(' ', '-') ? 'selected' : ''}`} 
                        onClick={() => setFormData({ ...formData, icon: iconPreset.name.toLowerCase().replace(' ', '-') })}
                        title={iconPreset.name}
                      >
                      <div className="ui-icon-box" style={{ backgroundColor: formData.headerColor, width: '40px', height: '40px' }}>
                          <IconComponent 
                            size={20}
                            color={formData.foregroundColor || '#ffffff'}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label>Icon Label</label>
                <input type="text" value={formData.iconLabel} onChange={(e) => setFormData({ ...formData, iconLabel: e.target.value })} placeholder="Chat with us" />
              </div>
              <div className="form-group">
                <label>Input Placeholder</label>
                <input type="text" value={formData.placeholder} onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })} placeholder="Type your message..." />
              </div>
              <div className="form-group">
                <label>Header Color</label>
                <div className="color-input-group">
                  <input type="color" value={formData.headerColor} onChange={(e) => setFormData({ ...formData, headerColor: e.target.value })} />
                  <input type="text" value={formData.headerColor} onChange={(e) => setFormData({ ...formData, headerColor: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Background Color</label>
                <div className="color-input-group">
                  <input type="color" value={formData.backgroundColor} onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })} />
                  <input type="text" value={formData.backgroundColor} onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>User Chat Color</label>
                <div className="color-input-group">
                  <input type="color" value={formData.userChatColor} onChange={(e) => setFormData({ ...formData, userChatColor: e.target.value })} />
                  <input type="text" value={formData.userChatColor} onChange={(e) => setFormData({ ...formData, userChatColor: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Bot Chat Color</label>
                <div className="color-input-group">
                  <input type="color" value={formData.botChatColor} onChange={(e) => setFormData({ ...formData, botChatColor: e.target.value })} />
                  <input type="text" value={formData.botChatColor} onChange={(e) => setFormData({ ...formData, botChatColor: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Chatbot Size</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" value={formData.chatbotSizeX} onChange={(e) => setFormData({ ...formData, chatbotSizeX: parseInt(e.target.value) })} placeholder="Width" style={{ flex: 1 }} />
                  <input type="number" value={formData.chatbotSizeY} onChange={(e) => setFormData({ ...formData, chatbotSizeY: parseInt(e.target.value) })} placeholder="Height" style={{ flex: 1 }} />
                </div>
              </div>
            </div>
            )}

            {/* Settings */}
            {step === 4 && (
            <div className="form-section">
              <h3><Settings size={20} /> Settings & Features</h3>
              <div className="checkbox-group">
                <input type="checkbox" checked={formData.desktop} onChange={(e) => setFormData({ ...formData, desktop: e.target.checked })} />
                <label>Show on Desktop</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.checked })} />
                <label>Show on Mobile</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={formData.autoOpen} onChange={(e) => setFormData({ ...formData, autoOpen: e.target.checked })} />
                <label>Auto-open on page load</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={formData.audioInput} onChange={(e) => setFormData({ ...formData, audioInput: e.target.checked })} />
                <label>Enable audio input</label>
              </div>
              <div className="form-group">
                <label>Icon Size (px)</label>
                <input type="number" value={formData.iconSize} onChange={(e) => setFormData({ ...formData, iconSize: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Header Size (px)</label>
                <input type="number" value={formData.headerSize} onChange={(e) => setFormData({ ...formData, headerSize: parseInt(e.target.value) })} />
              </div>
              {id && (
                <div className="form-group">
                  <button type="button" onClick={downloadEmbedCode} className="secondary">
                    <Download size={16} /> Download Embed Code
                  </button>
                </div>
              )}
            </div>
            )}
            <div className="step-nav">
              <button type="button" className="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</button>
              <div className="step-indicators">
                {[1,2,3,4].map((s) => (
                  <div key={s} className={`step-dot ${step === s ? 'active' : ''}`} />
                ))}
              </div>
              {step < 4 ? (
                <button type="button" onClick={() => setStep(Math.min(4, step + 1))}>Next</button>
              ) : (
                <button type="button" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              )}
            </div>
          </form>
        </div>

        {/* Right-side sticky preview */}
        <div className="preview-panel">
          <div className="preview-container" style={{ position: 'relative', width: Math.max(340, formData.chatbotSizeX * 0.8), height: Math.max(520, formData.chatbotSizeY * 0.8) }}>
            <div className="preview-header" style={{ backgroundColor: formData.headerColor, height: `${formData.headerSize}px`, display: 'flex', alignItems: 'center' }}>
              {formData.avatarUrl && (
                <img src={formData.avatarUrl} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px' }} />
              )}
              <span style={{ fontWeight: 'bold' }}>{formData.name || 'Your Chatbot'}</span>
            </div>
            <div className="preview-content" style={{ backgroundColor: formData.backgroundColor, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Chat area */}
              <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
                {/* Bot welcome */}
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <div style={{ maxWidth: '75%', background: formData.botChatColor, color: formData.botTextColor, padding: '8px 10px', borderRadius: 12, borderTopLeftRadius: 4 }}>
                    <div style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                    {formData.welcomeMessage || 'Hello! How can I help you today?'}
                    </div>
                  </div>
                </div>
                {/* User message */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <div style={{ maxWidth: '75%', background: formData.userChatColor, color: formData.userTextColor, padding: '8px 10px', borderRadius: 12, borderTopRightRadius: 4 }}>
                    I need help with my order.
                  </div>
                </div>
                {/* Bot reply */}
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <div style={{ maxWidth: '75%', background: formData.botChatColor, color: formData.botTextColor, padding: '8px 10px', borderRadius: 12, borderTopLeftRadius: 4 }}>
                    Sure! Could you share your order number?
                  </div>
                </div>
              </div>
              {/* Input area */}
              <div style={{ padding: 10, background: '#ffffff', borderRadius: 10, margin: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  readOnly
                  placeholder={formData.placeholder}
                  style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', fontSize: 12 }}
                />
                <button type="button" style={{ background: formData.headerColor, color: formData.foregroundColor, border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 12 }}>Send</button>
              </div>
            </div>
            {/* Floating icon preview on the side */}
            {formData.icon && (
              <div style={{ position: 'absolute', right: -56, bottom: 24, width: 48, height: 48, borderRadius: 24, background: formData.headerColor, boxShadow: '0 8px 16px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                {formData.icon.startsWith('http') ? (
                <img src={formData.icon} alt="icon" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                ) : (
                  (() => {
                    const iconPreset = iconPresets.find(preset => preset.name.toLowerCase().replace(' ', '-') === formData.icon)
                    if (iconPreset) {
                      const IconComponent = iconPreset.component
                      // Auto-determine icon color based on background brightness
                      const isLightBackground = formData.headerColor && (
                        formData.headerColor.toLowerCase() === '#ffffff' ||
                        formData.headerColor.toLowerCase() === '#fff' ||
                        formData.headerColor.toLowerCase().includes('fff')
                      )
                      const iconColor = isLightBackground ? '#000000' : '#ffffff'
                      return <IconComponent size={24} color={formData.foregroundColor || '#ffffff'} />
                    }
                    return <div style={{ color: formData.headerColor, fontSize: '12px' }}>?</div>
                  })()
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embed Code Modal */}
      {showEmbed && id && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <button className="modal-close" onClick={() => setShowEmbed(false)}>Close</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Chatbot Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Copy the code below to embed your chatbot on any website:</p>
            <div className="bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">{`// 1. Download the ChatBot component
curl -o botembed.tsx https://raw.githubusercontent.com/mnasim2004/chatbotai/main/components/botembed.tsx

// 2. Import and use in your React app
import ChatBot from "./botembed";

<ChatBot botId="${createdBotId || id}" />`}</pre>
            </div>
            <div className="flex space-x-3">
              <button onClick={downloadEmbedCode} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Download Instructions</button>
              <button onClick={() => setShowEmbed(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Global toasts are rendered by ToastProvider */}
    </div>
  );
}
  