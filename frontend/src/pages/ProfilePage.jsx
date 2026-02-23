// pages/ProfilePage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getProfile } from '../api/accountApi'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        setProfile(res.data)
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <MainLayout><Loader /></MainLayout>

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <h1 className="font-heading font-bold text-2xl text-slate-800 mb-6">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
              {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-slate-800">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Student'}
              </h2>
              <p className="text-slate-400 text-sm">{profile?.email}</p>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Member Since</p>
              <p className="font-semibold text-slate-700 text-sm">
                {profile?.joined_at
                  ? new Date(profile.joined_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })
                  : '—'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Interests</p>
              <p className="font-semibold text-slate-700 text-sm">
                {profile?.interests?.length || 0} selected
              </p>
            </div>
          </div>

          {/* Interests */}
          {profile?.interests?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-slate-400 mb-2">Your Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/change-password')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
            >
              Change Password
            </button>
            <button
              onClick={() => navigate('/update-interests')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
            >
              Update Interests
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h3 className="font-heading font-semibold text-red-500 mb-2">Danger Zone</h3>
          <p className="text-slate-400 text-sm mb-4">
            Permanently delete your account and all data.
          </p>
          <button
            onClick={() => navigate('/delete-account')}
            className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-xl transition-colors text-sm border border-red-100"
          >
            Delete Account
          </button>
        </div>

      </div>
    </MainLayout>
  )
}

export default ProfilePage