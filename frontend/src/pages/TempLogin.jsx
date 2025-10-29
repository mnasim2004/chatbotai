import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Sparkles } from 'lucide-react'
import { Card, CardInner, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'

export default function TempLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('Tester')
  const [email, setEmail] = useState('test@example.com')

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = { id: 'temp', name, email }
    const token = 'temp-token'
    localStorage.setItem('auth_user', JSON.stringify(user))
    localStorage.setItem('auth_token', token)
    login(user, token)
    navigate('/dashboard')
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg bg-white shadow-xl">
          <CardInner className="bg-white ring-1 ring-slate-200">
            <CardHeader className="mb-2 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                <Sparkles className="h-7 w-7" />
              </div>
              <CardTitle className="text-slate-900">Welcome back</CardTitle>
              <CardDescription className="text-slate-600">Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Name</label>
                  <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
                    <User className="h-5 w-5 text-blue-600" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Your name" required />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
                  <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="you@example.com" required />
                  </div>
                </div>

                <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow hover:bg-blue-700 transition">
                  Sign In
                </button>
              </form>

              <p className="mt-6 text-center text-xs font-medium text-slate-500">Dev-only — uses a dummy token for a quick preview.</p>
            </CardContent>
          </CardInner>
        </Card>
      </div>
    </div>
  )
}


