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
      await updateSettings(settings)
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
              <p className="text-slate-400 text-xs mt-0.5">
                Number of content items to show per page
              </p>
            </div>
            <select
              value={settings?.items_per_page || 10}
              onChange={(e) => handleChange('items_per_page', parseInt(e.target.value))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Show Thumbnails */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <p className="font-medium text-slate-700 text-sm">Show Thumbnails</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Display thumbnails on content cards
              </p>
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

          {/* Default Content Type */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700 text-sm">Default Content Type</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Default filter when opening the feed
              </p>
            </div>
            <select
              value={settings?.default_content_type || 'all'}
              onChange={(e) => handleChange('default_content_type', e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="all">All</option>
              <option value="video">Videos</option>
              <option value="news">News</option>
              <option value="article">Articles</option>
              <option value="book">Books</option>
            </select>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-heading font-semibold text-slate-700 mb-5">
            Notifications
          </h2>

          {/* Email Notifications */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <p className="font-medium text-slate-700 text-sm">Email Notifications</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Receive email updates about new content
              </p>
            </div>
            <button
              onClick={() =>
                handleChange('email_notifications', !settings?.email_notifications)
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings?.email_notifications ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  settings?.email_notifications ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-700 text-sm">Weekly Digest</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Get a weekly summary of top content
              </p>
            </div>
            <button
              onClick={() =>
                handleChange('weekly_digest', !settings?.weekly_digest)
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings?.weekly_digest ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  settings?.weekly_digest ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <h2 className="font-heading font-semibold text-slate-700 mb-5">
            Language & Region
          </h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-700 text-sm">Language</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Content language preference
              </p>
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