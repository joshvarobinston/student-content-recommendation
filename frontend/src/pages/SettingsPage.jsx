// pages/SettingsPage.jsx

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getSettings, updateSettings } from '../api/settingsApi'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'

const SettingsPage = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings()
        setSettings(res.data)
      } catch (error) {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // ✅ FIXED: Only send fields that actually exist in the backend model
      // Removed: email_notifications, weekly_digest, default_content_type (don't exist)
      await updateSettings({
        items_per_page: settings.items_per_page,
        show_thumbnails: settings.show_thumbnails,
        preferred_content_type: settings.preferred_content_type,
        language: settings.language,
        track_search_history: settings.track_search_history,
        track_view_history: settings.track_view_history,
      })
      toast.success('Settings saved successfully!')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to save settings'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <MainLayout><Loader /></MainLayout>

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-slate-800">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
        </div>

        {/* Content Preferences */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-heading font-semibold text-slate-700 mb-5">
            Content Preferences
          </h2>

          {/* Items Per Page */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <p className="font-medium text-slate-700 text-sm">Items Per Page</p>
              <p className="text-slate-400 text-xs mt-0.5">Number of content items per page</p>
            </div>
            <select
              value={settings?.items_per_page || 20}
              onChange={(e) => handleChange('items_per_page', parseInt(e.target.value))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Default Content Type */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <p className="font-medium text-slate-700 text-sm">Default Content Type</p>
              <p className="text-slate-400 text-xs mt-0.5">Preferred content type filter</p>
            </div>
            <select
              value={settings?.preferred_content_type || 'all'}
              onChange={(e) => handleChange('preferred_content_type', e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="all">All</option>
              <option value="video">Videos</option>
              <option value="news">News</option>
              <option value="article">Articles</option>
              <option value="book">Books</option>
            </select>
          </div>

          {/* Show Thumbnails */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700 text-sm">Show Thumbnails</p>
              <p className="text-slate-400 text-xs mt-0.5">Display thumbnails on content cards</p>
            </div>
            <button
              onClick={() => handleChange('show_thumbnails', !settings?.show_thumbnails)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings?.show_thumbnails ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  settings?.show_thumbnails ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-heading font-semibold text-slate-700 mb-5">Privacy</h2>

          {/* Track Search History */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <p className="font-medium text-slate-700 text-sm">Track Search History</p>
              <p className="text-slate-400 text-xs mt-0.5">Used to improve your recommendations</p>
            </div>
            <button
              onClick={() => handleChange('track_search_history', !settings?.track_search_history)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings?.track_search_history ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  settings?.track_search_history ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Track View History */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700 text-sm">Track View History</p>
              <p className="text-slate-400 text-xs mt-0.5">Used for popularity and ML scoring</p>
            </div>
            <button
              onClick={() => handleChange('track_view_history', !settings?.track_view_history)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings?.track_view_history ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  settings?.track_view_history ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <h2 className="font-heading font-semibold text-slate-700 mb-5">Language</h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-700 text-sm">Content Language</p>
              <p className="text-slate-400 text-xs mt-0.5">Language for recommended content</p>
            </div>
            <select
              value={settings?.language || 'en'}
              onChange={(e) => handleChange('language', e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

      </div>
    </MainLayout>
  )
}

export default SettingsPage
