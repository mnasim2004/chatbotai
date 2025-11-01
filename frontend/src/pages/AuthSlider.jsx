import { useEffect, useState } from 'react'
import './auth-slider.css'
import { authAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast/ToastProvider.jsx'

export default function AuthSlider() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signinEmail, setSigninEmail] = useState('')
  const [signinPassword, setSigninPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const signUpButton = document.getElementById('signUp')
    const signInButton = document.getElementById('signIn')
    const container = document.getElementById('container')

    const onSignUp = () => container?.classList.add('right-panel-active')
    const onSignIn = () => container?.classList.remove('right-panel-active')

    signUpButton?.addEventListener('click', onSignUp)
    signInButton?.addEventListener('click', onSignIn)

    return () => {
      signUpButton?.removeEventListener('click', onSignUp)
      signInButton?.removeEventListener('click', onSignIn)
    }
  }, [])

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!signupName || !signupEmail || !signupPassword) return
    setLoading(true)
    try {
      const res = await authAPI.signup({ name: signupName, email: signupEmail, password: signupPassword })
      const { token, user } = res.data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      login(user, token)
      toast.success('Account created. Welcome aboard!')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignin = async (e) => {
    e.preventDefault()
    if (!signinEmail || !signinPassword) return
    setLoading(true)
    try {
      const res = await authAPI.login({ email: signinEmail, password: signinPassword })
      const { token, user } = res.data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      login(user, token)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTempLogin = () => {
    const user = { id: 'temp', name: 'Guest', email: 'guest@example.com' }
    const token = 'temp-token'
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    login(user, token)
    toast.info('Signed in as guest')
    navigate('/dashboard')
  }

  return (
    <div className="auth-slider-root animate-fadeInUp">
      <div className="container animate-scaleIn" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <div className="social-container animate-fadeInUp">
              <a href="#" className="social hover-scale">f</a>
              <a href="#" className="social hover-scale">G</a>
              <a href="#" className="social hover-scale">in</a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" value={signupName} onChange={(e)=>setSignupName(e.target.value)} className="animate-fadeInUp" />
            <input type="email" placeholder="Email" value={signupEmail} onChange={(e)=>setSignupEmail(e.target.value)} className="animate-fadeInUp" />
            <input type="password" placeholder="Password" value={signupPassword} onChange={(e)=>setSignupPassword(e.target.value)} className="animate-fadeInUp" />
            <button type="submit" disabled={loading} className="animate-fadeInUp hover-glow">{loading ? 'Please wait...' : 'Sign Up'}</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignin}>
            <h1>Login</h1>
            <div className="social-container animate-fadeInUp">
              <a href="#" className="social hover-scale">f</a>
              <a href="#" className="social hover-scale">G</a>
              <a href="#" className="social hover-scale">in</a>
            </div>
            <span>use your account</span>
            <input type="email" placeholder="Email" value={signinEmail} onChange={(e)=>setSigninEmail(e.target.value)} className="animate-fadeInUp" />
            <input type="password" placeholder="Password" value={signinPassword} onChange={(e)=>setSigninPassword(e.target.value)} className="animate-fadeInUp" />
            <a href="#" className="animate-fadeInUp">Forgot your password?</a>
            <button type="submit" disabled={loading} className="animate-fadeInUp hover-glow">{loading ? 'Please wait...' : 'Login'}</button>
            <button type="button" className="ghost animate-fadeInUp hover-scale" onClick={handleTempLogin}>Continue as guest</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost hover-glow" id="signIn">Login</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost hover-glow" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
