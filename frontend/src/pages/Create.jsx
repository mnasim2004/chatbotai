import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Eye } from 'lucide-react'
import { useToast } from '../components/Toast/ToastProvider.jsx'

export default function CreateChatbot() {
  const navigate = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [createdBotId, setCreatedBotId] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    behavior: '',
    details: '',
    avatarUrl: '',
    icon: '',
    iconLabel: 'Chat with us',
    iconSize: 60,
    placeholder: 'Type your message...',
    headerColor: '#3b82f6',
    foregroundColor: '#ffffff',
    backgroundColor: '#f3f4f6',
    userChatColor: '#3b82f6',
    botChatColor: '#e5e7eb',
    userTextColor: '#ffffff',
    botTextColor: '#000000',
    headerSize: 60,
    chatbotSizeX: 400,
    chatbotSizeY: 600,
    audioInput: false,
    desktop: true,
    mobile: true,
    autoOpen: false,
    welcomeMessage: 'Hello! How can I help you today?'
  })

  const [images, setImages] = useState([])
  const [faqs, setFaqs] = useState([])

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const description = prompt('What does this image show?')
        if (description) {
          setImages((prev) => [...prev, { description, dataUrl: event.target?.result }])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }])
  const updateFaq = (i, field, value) => {
    const arr = [...faqs]
    arr[i][field] = value
    setFaqs(arr)
  }
  const removeFaq = (i) => setFaqs(faqs.filter((_, idx) => idx !== i))
  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        navigate('/login')
        return
      }

      const submitData = new FormData()
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, String(v)))
      submitData.append('images', JSON.stringify(images))
      submitData.append('faqs', JSON.stringify(faqs))

      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/chatbots', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      })
      const data = await res.json()
      if (res.ok) {
        setCreatedBotId(data.botId || data.chatbot?.botId || data.id)
        setStep(4)
        toast.success('Chatbot created successfully')
      } else {
        toast.error(data.error || 'Failed to create chatbot')
      }
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Name *</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="My Support Bot" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" rows={3} placeholder="A helpful chatbot for customer support" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How should the chatbot behave?</label>
        <textarea value={formData.behavior} onChange={(e) => setFormData({ ...formData, behavior: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" rows={4} placeholder="Be friendly, professional, and helpful. Always greet users warmly..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Details the chatbot should know</label>
        <textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" rows={4} placeholder="Company info, product details, policies, etc." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Optional)</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
        <label htmlFor="image-upload" className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition w-fit">
          <Upload size={20} />
          Upload Images
        </label>
        {images.length > 0 && (
          <div className="mt-4 space-y-2">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <img src={img.dataUrl} alt="" className="w-16 h-16 object-cover rounded" />
                <span className="flex-1 text-sm text-gray-700">{img.description}</span>
                <button onClick={() => removeImage(idx)} className="text-red-500 hover:text-red-700">
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Appearance & Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
          <input type="url" value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://example.com/avatar.png" />
        </div>
        <div>
          <label className="block text sm font-medium text-gray-700 mb-2">Icon URL</label>
          <input type="url" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://example.com/icon.png" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon Label</label>
          <input type="text" value={formData.iconLabel} onChange={(e) => setFormData({ ...formData, iconLabel: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon Size (px)</label>
          <input type="number" value={formData.iconSize} onChange={(e) => setFormData({ ...formData, iconSize: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
          <input type="text" value={formData.placeholder} onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
          <input type="text" value={formData.welcomeMessage} onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        <div className="space-y-3">
          {[
            { key: 'audioInput', label: 'Audio Input' },
            { key: 'desktop', label: 'Enable on Desktop' },
            { key: 'mobile', label: 'Enable on Mobile' },
            { key: 'autoOpen', label: 'Auto Open' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData[item.key]} onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })} className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Colors & Sizing</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { key: 'headerColor', label: 'Header Color' },
          { key: 'foregroundColor', label: 'Foreground Color' },
          { key: 'backgroundColor', label: 'Background Color' },
          { key: 'userChatColor', label: 'User Chat Color' },
          { key: 'botChatColor', label: 'Bot Chat Color' },
          { key: 'userTextColor', label: 'User Text Color' },
          { key: 'botTextColor', label: 'Bot Text Color' },
        ].map((item) => (
          <div key={item.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{item.label}</label>
            <div className="flex gap-2">
              <input type="color" value={formData[item.key]} onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })} className="w-16 h-12 rounded cursor-pointer" />
              <input type="text" value={formData[item.key]} onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Header Size (px)</label>
          <input type="number" value={formData.headerSize} onChange={(e) => setFormData({ ...formData, headerSize: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
          <input type="number" value={formData.chatbotSizeX} onChange={(e) => setFormData({ ...formData, chatbotSizeX: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
          <input type="number" value={formData.chatbotSizeY} onChange={(e) => setFormData({ ...formData, chatbotSizeY: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">FAQs</label>
          <button onClick={addFaq} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={18} />
            Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">FAQ {idx + 1}</span>
                <button onClick={() => removeFaq(idx)} className="text-red-500 hover:text-red-700">
                  <X size={18} />
                </button>
              </div>
              <input type="text" value={faq.question} onChange={(e) => updateFaq(idx, 'question', e.target.value)} placeholder="Question" className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              <textarea value={faq.answer} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} placeholder="Answer" rows={2} className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800">Chatbot Created!</h2>
      <p className="text-gray-600">Your chatbot ID: <code className="bg-gray-100 px-3 py-1 rounded font-mono">{createdBotId}</code></p>
      <div className="bg-gray-50 p-6 rounded-lg text-left space-y-4">
        <h3 className="font-bold text-gray-800">Installation Instructions</h3>
        <div>
          <p className="text-sm text-gray-600 mb-2">1. Download the chatbot component:</p>
          <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">curl -o botembed.tsx https://raw.githubusercontent.com/mnasim2004/chatbotai/main/components/botembed.tsx</code>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">2. Import and use in your React app:</p>
          <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">{`import ChatBot from './botembed';\n\n<ChatBot botId="${createdBotId}" />`}</code>
        </div>
      </div>
      <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Go to Dashboard</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Chatbot</h1>
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <Eye size={18} />
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={showPreview ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            {step !== 4 && (
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                ))}
              </div>
            )}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderSuccess()}
            {step !== 4 && (
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Previous</button>
                )}
                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Next</button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading || !formData.name} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Chatbot'}
                  </button>
                )}
              </div>
            )}
          </div>
          {showPreview && step !== 4 && (
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Live Preview</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Preview will appear here</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
