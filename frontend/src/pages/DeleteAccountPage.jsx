// pages/DeleteAccountPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteAccount } from '../api/accountApi'
import { clearTokens } from '../utils/token'
import MainLayout from '../layouts/MainLayout'

const DeleteAccountPage = () => {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirmed) {
      toast.error('Please check the confirmation box first')
      return
    }

    setLoading(true)
    try {
      await deleteAccount({ confirm: true })
      clearTokens()
      toast.success('Account deleted successfully')
      navigate('/')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete account'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">

        <h1 className="font-heading font-bold text-2xl text-slate-800 mb-6">Delete Account</h1>

        {/* Warning Card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-5">
          <h2 className="font-heading font-semibold text-red-600 text-lg mb-3">
            ⚠️ This action is permanent!
          </h2>
          <p className="text-red-500 text-sm leading-relaxed mb-4">
            Deleting your account will permanently remove all your data including:
          </p>
          <ul className="text-red-400 text-sm space-y-1 mb-4 pl-4">
            <li>• Your profile and interests</li>
            <li>• All saved and liked content</li>
            <li>• All library folders</li>
            <li>• Your engagement history</li>
          </ul>
          <p className="text-red-500 text-sm font-semibold">
            This cannot be undone!
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-red-500"
            />
            <span className="text-sm text-slate-600">
              I understand this action is permanent and cannot be undone. I want to delete my account.
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || !confirmed}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {loading ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>

        </div>

      </div>
    </MainLayout>
  )
}

export default DeleteAccountPage