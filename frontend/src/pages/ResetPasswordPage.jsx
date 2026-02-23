// pages/ResetPasswordPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resetPassword } from '../api/authApi'

const ResetPasswordPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    token: '',
    new_password: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)

  // ✅ Pre-fill email and token from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('reset_email')
    const savedToken = localStorage.getItem('reset_token')
    if (savedEmail || savedToken) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail || '',
        token: savedToken || '',
      }))
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.token || !formData.new_password) {
      toast.error('All fields are required')
      return
    }
    if (formData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await resetPassword({
        email: formData.email,
        token: formData.token,
        new_password: formData.new_password,
      })

      // ✅ Clear reset data from localStorage
      localStorage.removeItem('reset_token')
      localStorage.removeItem('reset_email')

      toast.success('Password reset successful! Please login.')
      navigate('/login')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Invalid or expired token. Please try again.'
      toast.error(msg)
    } finally {
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

          <h2 className="font-heading font-bold text-2xl text-white mb-1">Reset Password</h2>
          <p className="text-white/50 text-sm mb-6">
            Enter your reset token and new password
          </p>

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

            {/* Reset Token */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Reset Token</label>
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleChange}
                placeholder="Paste your reset token"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all mt-2"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage