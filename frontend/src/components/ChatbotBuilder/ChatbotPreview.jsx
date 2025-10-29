import React from 'react';
import { Bot, MessageCircle, MessageSquare, Send, Sparkles, Star, Headphones, HelpCircle, Smile } from 'lucide-react';

export default function ChatbotPreview({ config, botId }) {
  const {
    headerColor,
    backgroundColor,
    chatbotSizeX,
    chatbotSizeY,
    avatarUrl,
    welcomeMessage,
    userChatColor,
    botChatColor,
    userTextColor,
    botTextColor,
    placeholder,
    icon,
    iconLabel,
    foregroundColor,
  } = config

  // Auto-determine icon color based on background brightness
  const isLightBackground = headerColor && (
    headerColor.toLowerCase() === '#ffffff' ||
    headerColor.toLowerCase() === '#fff' ||
    headerColor.toLowerCase().includes('fff')
  )
  const iconColor = isLightBackground ? '#000000' : '#ffffff'

  // Icon mapping
  const iconMap = {
    'bot': Bot,
    'message-circle': MessageCircle,
    'message-square': MessageSquare,
    'send': Send,
    'sparkles': Sparkles,
    'star': Star,
    'headphones': Headphones,
    'help-circle': HelpCircle,
    'smile': Smile
  }

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || MessageCircle
  }

  // Use actual chatbot dimensions
  const chatWidth = chatbotSizeX || 400
  const chatHeight = chatbotSizeY || 600
  const headerSize = 60

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Main Chatbot Container - Exact Match */}
        <div
          className="flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: chatWidth,
            height: chatHeight,
            backgroundColor: backgroundColor,
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          }}
        >
        {/* Header - Exact Match */}
        <div className="flex items-center justify-between px-4 flex-shrink-0" style={{ 
          height: '60px', 
          background: `linear-gradient(45deg, ${headerColor}, ${headerColor}dd)`,
          color: foregroundColor || '#ffffff',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '28px', height: '28px', backgroundColor: 'rgba(255,255,255,0.15)', paddingRight: '4px' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" style={{ opacity: 0.95 }} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Chatbot Preview</h3>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', opacity: 0.9, padding: '2px 6px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.12)', width: 'fit-content', marginTop: '2px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  flexShrink: 0
                }} />
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-0">
            <button style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', opacity: 0.8 }} aria-label="Minimize">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', opacity: 0.8 }} aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area - Exact Match */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ 
          backgroundColor: backgroundColor,
          height: `${chatHeight - 120}px`,
          padding: '16px',
          paddingBottom: '80px'
        }}>
          <div className="flex justify-start" style={{ marginBottom: '12px' }}>
            <div className="max-w-[85%] shadow-sm" style={{ 
              backgroundColor: botChatColor, 
              color: botTextColor,
              borderRadius: '4px 18px 18px 18px',
              padding: '8px 12px',
              fontSize: '13px',
              lineHeight: '1.4',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '85%'
            }}>
              <p style={{ margin: 0, fontSize: '13px', wordBreak: 'break-word' }}>{welcomeMessage}</p>
              <span style={{ 
                fontSize: '10px', 
                opacity: 0.7, 
                display: 'block',
                marginTop: '4px'
              }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Input Area - Exact Match */}
        <div className="p-3 flex-shrink-0" style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px',
          background: backgroundColor,
          display: 'flex',
          gap: '6px'
        }}>
          <form className="flex gap-2 w-full">
            <input
              type="text"
              disabled
              placeholder={placeholder || 'Type your message...'}
              style={{ 
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '8px 12px',
                outline: 'none',
                flex: 1,
                fontSize: '13px',
                backgroundColor: 'white'
              }}
            />
            <button 
              type="submit"
              disabled
              style={{ 
                backgroundColor: headerColor, 
                color: foregroundColor || '#ffffff',
                width: '32px',
                height: '32px',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '6px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
      
      {/* Floating Icon - Exact Match */}
      {icon && (
        <button
          className="group hover:scale-110 transition-all duration-200"
          style={{
            position: 'absolute',
            right: '-56px',
            bottom: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            background: headerColor,
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Open chat"
        >
          {icon ? (
            // Check if it's a URL (for backward compatibility)
            icon.startsWith('http') ? (
              <img
                src={icon}
                alt="Chat"
                style={{ 
                  width: '60%', 
                  height: '60%', 
                  objectFit: 'contain'
                }}
              />
            ) : (
              // Use Lucide icon component
              (() => {
                const IconComponent = getIconComponent(icon)
                if (!IconComponent) {
                  return <div style={{ color: iconColor, fontSize: '12px' }}>?</div>
                }
                return (
                  <IconComponent
                    size={24}
                    style={{ color: iconColor }}
                  />
                )
              })()
            )
          ) : (
            <MessageCircle
              size={24}
              style={{ color: iconColor }}
            />
          )}
           {iconLabel && (
             <div 
               className="absolute right-full mr-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none transform translate-x-4 group-hover:translate-x-0"
               style={{
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 color: 'white',
                 padding: '8px 14px',
                 borderRadius: '16px',
                 fontSize: '14px',
                 fontWeight: '600',
                 whiteSpace: 'nowrap',
                 boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 255, 255, 0.2)',
                 zIndex: 1000
               }}
             >
               <div 
                 style={{
                   position: 'absolute',
                   inset: 0,
                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                   borderRadius: '16px',
                   filter: 'blur(8px)',
                   opacity: 0.4,
                   zIndex: -1
                 }}
               />
               <div style={{ 
                 position: 'relative', 
                 zIndex: 10, 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '10px',
                 textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
               }}>
                 <div 
                   style={{
                     width: '8px',
                     height: '8px',
                     backgroundColor: '#10b981',
                     borderRadius: '50%',
                     animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                     boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)'
                   }}
                 />
                 <span style={{ letterSpacing: '0.5px' }}>{iconLabel}</span>
               </div>
             </div>
           )}
        </button>
      )}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}