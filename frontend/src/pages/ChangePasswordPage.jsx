// pages/ChangePasswordPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { changePassword } from '../api/accountApi'
import MainLayout from '../layouts/MainLayout'

const ChangePasswordPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      toast.error('All fields are required')
      return
    }
    if (formData.new_password.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      })
      toast.success('Password changed successfully!')
      navigate('/profile')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to change password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">

        <h1 className="font-heading font-bold text-2xl text-slate-800 mb-6">Change Password</h1>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Old Password */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Current Password</label>
              <input
                type="password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                placeholder="Your current password"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </MainLayout>
  )
}

export default ChangePasswordPage