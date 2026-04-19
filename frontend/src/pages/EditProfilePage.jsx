// pages/EditProfilePage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getProfile, updateProfile } from '../api/accountApi'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'

const EditProfilePage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        setFormData({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
        })
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.first_name || !formData.last_name) {
      toast.error('Both fields are required')
      return
    }

    setSaving(true)
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
      navigate('/profile')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update profile'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <MainLayout><Loader /></MainLayout>

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">

        <h1 className="font-heading font-bold text-2xl text-white mb-6">Edit Profile</h1>

        <div className="bg-[#1e2535] rounded-2xl border border-white/10 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 font-semibold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </MainLayout>
  )
}

export default EditProfilePage