import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { resetPassword } from '../api/authApi'
import { clearPendingOtp, getPendingOtp } from '../utils/token'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    new_password: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pendingOtp = getPendingOtp()
    if (pendingOtp?.purpose === 'password_reset') {
      setFormData((prev) => ({
        ...prev,
        email: pendingOtp.email || '',
      }))
    }
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.otp || !formData.new_password) {
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
        otp: formData.otp,
        new_password: formData.new_password,
      })

      clearPendingOtp()
      toast.success('Password reset successful! Please login.')
      navigate('/login')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.new_password?.[0] ||
        'Invalid or expired OTP. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-white">
            S
          </div>
          <span className="font-heading font-bold text-2xl text-white">StudentReco</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="font-heading font-bold text-2xl text-white mb-1">Reset Password</h2>
          <p className="text-white/50 text-sm mb-6">
            Enter your OTP and new password
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">OTP Code</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter the 6-digit OTP"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

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
