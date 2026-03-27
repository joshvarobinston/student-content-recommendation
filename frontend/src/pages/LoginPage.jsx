// pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login } from '../api/authApi'
import { saveTokens } from '../utils/token'
import { getProfile } from '../api/accountApi'

const LoginPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('All fields are required')
      return
    }

    setLoading(true)
    try {
      const res = await login({
      email: formData.email,
      password: formData.password,
    })

      // ✅ Save tokens
      saveTokens(res.data.access, res.data.refresh)

      // ✅ Check if user has interests
      const profileRes = await getProfile()
      const hasInterests = profileRes.data.interests?.length > 0

      toast.success('Login successful!')

      if (hasInterests) {
        navigate('/feed')       // Returning user
      } else {
      navigate('/interests')  // New user — first time only
      }
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Invalid email or password'
      toast.error(msg)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-white">
            S
          </div>
          <span className="font-heading font-bold text-2xl text-white">StudentReco</span>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <h2 className="font-heading font-bold text-2xl text-white mb-1">Welcome Back!</h2>
          <p className="text-white/50 text-sm mb-6">Login to continue learning smarter</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all mt-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage