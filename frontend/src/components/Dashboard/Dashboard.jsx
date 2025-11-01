import { useState, useEffect } from 'react';
import { useToast } from '../Toast/ToastProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatbotAPI } from '../../utils/api';
import { 
  Plus, 
  Bot, 
  Trash2, 
  Edit, 
  ExternalLink, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  Settings,
  BarChart3,
  Zap,
  Star,
  Activity,
  Code2,
  Copy,
  FileDown
} from 'lucide-react';
import Modal from '../Modal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [embedModal, setEmbedModal] = useState({ open: false, bot: null });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchChatbots();
  }, [user]);

  const fetchChatbots = async () => {
    try {
      const response = await chatbotAPI.getAll();
      setChatbots(response.data.chatbots);
    } catch (error) {
      console.error('Failed to fetch chatbots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) return;
    
    try {
      await chatbotAPI.delete(id);
      setChatbots(chatbots.filter(bot => bot._id !== id));
      toast.success('Chatbot deleted');
    } catch (error) {
      toast.error('Failed to delete chatbot');
    }
  };

  // Mock stats for now - in real app, these would come from API
  const stats = [
    { icon: <Bot size={24} />, label: 'Total Bots', value: chatbots.length, color: 'text-blue-600' },
    { icon: <MessageCircle size={24} />, label: 'Messages Today', value: '1,247', color: 'text-green-600' },
    { icon: <Users size={24} />, label: 'Active Users', value: '892', color: 'text-purple-600' },
    { icon: <TrendingUp size={24} />, label: 'Growth Rate', value: '+23%', color: 'text-orange-600' }
  ];

  const quickActions = [
    { icon: <Plus size={20} />, label: 'Create Bot', action: () => navigate('/builder'), color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: <Settings size={20} />, label: 'Settings', action: () => {}, color: 'bg-gray-600 hover:bg-gray-700' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', action: () => {}, color: 'bg-green-600 hover:bg-green-700' },
    { icon: <Zap size={20} />, label: 'Templates', action: () => {}, color: 'bg-purple-600 hover:bg-purple-700' }
  ];

  const getEmbedCode = (bot) => {
    const id = bot?.botId || bot?._id || 'YOUR_BOT_ID';
    return `// 1. Download the ChatBot component
curl -o botembed.tsx https://raw.githubusercontent.com/mnasim2004/chatbotai/main/components/botembed.tsx

// 2. Import and use in your React app
import ChatBot from "./botembed";

<ChatBot botId="${id}" />`;
  };

  const handleCopyEmbed = async (bot) => {
    try {
      await navigator.clipboard.writeText(getEmbedCode(bot));
      toast.success('Embed code copied');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadEmbed = (bot) => {
    const content = getEmbedCode(bot);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'embed-instructions.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadComponent = async () => {
    try {
      const url = 'https://raw.githubusercontent.com/mnasim2004/chatbotai/main/components/botembed.tsx';
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'botembed.tsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success('Component downloaded');
    } catch (e) {
      toast.error('Failed to download component');
    }
  };

  return (
    <div className="dashboard-full-width animate-fadeInUp" style={{ paddingTop: '80px' }}>
      <div className="container">
        {/* Global toasts are rendered by ToastProvider */}
        
        {/* Header Section */}
        <div className="dashboard-header-section animate-fadeInUp" style={{ marginBottom: '10px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3><Bot size={20} /> Dashboard</h3>
              <p className="text-sm text-gray-500" style={{ margin: '5px 0' }}>Welcome back, {user?.name}!</p>
            </div>
          </div>
        </div>

        {/* Analytics Container - Full width */}
        <div className="analytics-container animate-fadeInUp">
          <div className="analytics-grid">
            {stats.map((stat, index) => (
              <div key={index} className="analytics-card hover-lift">
                <div className="analytics-icon">{stat.icon}</div>
                <div className="analytics-content">
                  <div className="analytics-value">{stat.value}</div>
                  <div className="analytics-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chatbots Section */}

        <div className="small-section-header animate-fadeInUp" style={{ marginTop: '40px' }}>
          <h3 className="small-section-title">Your Chatbots</h3>
          <p className="small-section-description">Manage and monitor your AI assistants</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : chatbots.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm animate-fadeInUp">
            <div className="absolute inset-0 opacity-70 pointer-events-none" style={{
              background: 'radial-gradient(1200px 400px at -10% -20%, rgba(59,130,246,0.08), transparent 50%), radial-gradient(800px 300px at 120% 10%, rgba(168,85,247,0.08), transparent 50%)'
            }} />
            <div className="relative px-8 py-14 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Create your first bot</h3>
              <p className="mt-2 text-gray-600 max-w-xl mx-auto">Design, customize, and deploy an AI assistant that matches your brand. You can always edit its look, knowledge and behavior later.</p>
              <div className="mt-5 max-w-md mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    onClick={() => navigate('/builder')}
                    className="our-team create-card hover-lift cursor-pointer"
                    style={{ padding: '10px', borderRadius: '12px', minHeight: 'auto' }}
                  >
                    <Plus size={20} />
                    <h3 className="name" style={{ marginTop: '6px', color: 'white', fontSize: '14px' }}>Create Chatbot</h3>
                    <p className="title" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '10px' }}>Start building your AI assistant</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row animate-stagger">
            {/* Create New Chatbot Card */}
            <div className="col-6 col-md-4 col-lg-3">
              <div className="our-team create-card hover-lift" onClick={() => navigate('/builder')}>
                <Plus size={60} />
                <h3 className="name" style={{ marginTop: '20px', color: 'white' }}>Create New Bot</h3>
                <p className="title" style={{ color: 'rgba(255,255,255,0.8)' }}>Start building your AI assistant</p>
              </div>
            </div>
            
              {chatbots.map((bot, index) => (
                <div key={bot._id} className="col-6 col-md-4 col-lg-3">
                <div className="our-team hover-lift">
                  <div className="picture">
                    {bot.avatarUrl ? (
                      <img
                        className="img-fluid"
                        src={bot.avatarUrl}
                        alt={bot.name}
                        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center' }}
                      />
                    ) : (
                      <div
                        className="img-fluid bot-placeholder"
                        style={{ width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Bot size={40} />
                      </div>
                    )}
                  </div>
                  <div className="team-content">
                    <h3 className="name">{bot.name}</h3>
                    <h4 className="title">{bot.description || 'AI Assistant'}</h4>
                  </div>
                  <ul className="social">
                    <li>
                      <button 
                        onClick={() => navigate(`/builder/${bot._id}`)}
                        className="action-button edit-button hover-scale"
                        title="Edit Bot"
                      >
                        <Edit size={16} />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => window.open(`/embed/${bot.botId || bot._id}`, '_blank')}
                        className="action-button embed-button hover-scale"
                        title="View Embed"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { setEmbedModal({ open: true, bot }); try { toast.info('Opening embed code…'); } catch {} }}
                        className="action-button edit-button hover-scale"
                        title="Get Embed Code"
                      >
                        <Code2 size={16} />
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleDelete(bot._id)}
                        className="action-button delete-button hover-scale"
                        title="Delete Bot"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions Section - Bottom of page */}
        <div className="small-section-header animate-fadeInUp" style={{ marginTop: '40px' }}>
          <h3 className="small-section-title">Quick Actions</h3>
          <p className="small-section-description">Common tasks and shortcuts</p>
        </div>
        <div className="quick-actions-container animate-fadeInUp">
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="quick-action-card hover-lift cursor-pointer" onClick={action.action}>
                <div className="quick-action-icon">{action.icon}</div>
                <div className="quick-action-content">
                  <div className="quick-action-label">{action.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Code Modal */}
      <Modal
        isOpen={embedModal.open}
        onClose={() => setEmbedModal({ open: false, bot: null })}
        title=""
        size="small"
        hideHeader
        containerClassName="bg-transparent border-0 shadow-none"
      >
        {
          <div className="w-[320px] mx-auto bg-white text-black rounded-2xl p-6 pb-8 text-center">
            <div className="flex justify-end">
              <button onClick={() => setEmbedModal({ open: false, bot: null })} className="w-7 h-7 text-[18px] text-gray-400 hover:text-gray-600">✖</button>
            </div>
            <div className="mt-1">
              <p className="text-[16px] mb-3">Copy the embed code or download the component</p>
              <div className="text-left">
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg overflow-auto text-xs" style={{ maxHeight: '220px' }}>
{getEmbedCode(embedModal.bot)}
                </pre>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <button onClick={() => handleCopyEmbed(embedModal.bot)} className="accept inline-flex items-center justify-center w-full rounded-md bg-[#3B82F6] text-white py-3 text-sm font-semibold shadow-md hover:opacity-95">
                <Copy size={16} className="mr-2" /> Copy Code
              </button>
              <button onClick={handleDownloadComponent} className="inline-flex items-center justify-center w-full rounded-md bg-gray-800 text-white py-3 text-sm font-semibold shadow-md hover:opacity-95">
                <FileDown size={16} className="mr-2" /> Download Component
              </button>
              <button onClick={() => handleDownloadEmbed(embedModal.bot)} className="inline-flex items-center justify-center w-full rounded-md bg-gray-100 text-gray-800 py-3 text-sm font-semibold shadow hover:bg-gray-200">
                <FileDown size={16} className="mr-2" /> Download Instructions
              </button>
            </div>
          </div>
        }
      </Modal>
    </div>
  );
}