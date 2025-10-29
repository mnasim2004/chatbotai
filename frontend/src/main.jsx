import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './style.css'
import { AuthProvider } from './context/AuthContext.jsx'
import Header from './components/Header/Header.jsx'
import './components/Header/header.css'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ChatbotBuilder from './components/ChatbotBuilder/ChatbotBuilder.jsx'
import Create from './pages/Create.jsx'
import Home from './pages/Home.jsx'
import Embed from './pages/Embed.jsx'
import TempLogin from './pages/TempLogin.jsx'
import AuthSlider from './pages/AuthSlider.jsx'
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute.jsx'
import { ToastProvider } from './components/Toast/ToastProvider.jsx'

function AppRoutes() {
  return (
    <>
      <Header />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><AuthSlider /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><AuthSlider /></PublicRoute>} />
          <Route path="/temp-login" element={<PublicRoute><TempLogin /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><ChatbotBuilder /></ProtectedRoute>} />
          <Route path="/builder/:id" element={<ProtectedRoute><ChatbotBuilder /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
          <Route path="/embed/:id" element={<Embed />} />
          <Route path="/auth" element={<PublicRoute><AuthSlider /></PublicRoute>} />
        </Routes>
      </div>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
