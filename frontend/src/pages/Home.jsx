import { Link } from 'react-router-dom'
import ChatBot from '../components/botembed.jsx'
import { Bot, MessageCircle, Zap, Shield, Globe, Users, Star, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import './AuthSlider.jsx'
import '../style.css'

export default function Home() {

  const features = [
    {
      icon: <Bot size={32} />,
      title: "AI-Powered Conversations",
      description: "Advanced natural language processing for human-like interactions"
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast Setup",
      description: "Create and deploy your chatbot in under 5 minutes"
    },
    {
      icon: <Shield size={32} />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: <Globe size={32} />,
      title: "Multi-Language Support",
      description: "Communicate with users in over 50 languages"
    },
    {
      icon: <Users size={32} />,
      title: "Team Collaboration",
      description: "Work together with your team to perfect your bot"
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Custom Branding",
      description: "Match your brand colors, fonts, and personality"
    }
  ]

  const stats = [
    { number: "AI-Powered", label: "Conversations" },
    { number: "Easy", label: "Setup" },
    { number: "Secure", label: "Platform" },
    { number: "24/7", label: "Support" }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section animate-fadeInUp">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title animate-slideInDown">
              Build Intelligent Chatbots
              <span className="gradient-text"> That Actually Work</span>
            </h1>
            <p className="hero-description animate-fadeInUp">
              Create, customize, and deploy AI-powered chatbots for your website in minutes. 
              No coding required. Start engaging your customers 24/7.
            </p>
            <div className="hero-buttons animate-fadeInUp">
              <Link to="/login" className="cta-button primary hover-glow">
                <Sparkles size={20} />
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="cta-button secondary hover-scale">
                <MessageCircle size={20} />
                Try Demo
              </Link>
            </div>
            <div className="hero-stats animate-fadeInUp">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual animate-fadeInRight">
            <div className="chatbot-preview">
              <div className="chat-header">
                <div className="chat-avatar">
                  <Bot size={24} />
                </div>
                <div className="chat-info">
                  <h4>AI Assistant</h4>
                  <span className="status">Online</span>
                </div>
              </div>
              <div className="chat-messages">
                <div className="message bot-message">
                  <div className="message-content">
                    Hi! I'm here to help you. How can I assist you today?
                  </div>
                </div>
                <div className="message user-message">
                  <div className="message-content">
                    I need help with my order
                  </div>
                </div>
                <div className="message bot-message">
                  <div className="message-content">
                    I'd be happy to help! Can you provide your order number?
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button className="send-button">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header animate-fadeInUp">
            <h2 className="section-title">Why Choose ChatBot AI?</h2>
            <p className="section-description">
              Everything you need to create, manage, and optimize your AI chatbot
            </p>
          </div>
          <div className="features-grid animate-stagger">
            {features.map((feature, index) => (
              <div key={index} className="feature-card hover-lift">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content animate-fadeInUp">
            <h2 className="cta-title">Ready to Build Your First AI Chatbot?</h2>
            <p className="cta-description">
              Create intelligent chatbots that engage your customers and grow your business
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="cta-button primary large hover-glow">
                <Sparkles size={24} />
                Start Building Now
                <ArrowRight size={24} />
              </Link>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>Easy to use</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>No coding required</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>Customizable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chatbot */}
      <div className="floating-chatbot animate-fadeInRight">
        <ChatBot botId="1761666033973ddmemey5b" />
      </div>
    </div>
  )
}


