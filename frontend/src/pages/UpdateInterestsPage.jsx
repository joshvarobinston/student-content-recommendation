// pages/UpdateInterestsPage.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getInterestDomains, saveInterests } from '../api/interestsApi'
import { getProfile } from '../api/accountApi'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'

const MIN_INTERESTS = 3

const UpdateInterestsPage = () => {
  const navigate = useNavigate()

  const [domains, setDomains] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [domainsRes, profileRes] = await Promise.all([
          getInterestDomains(),
          getProfile(),
        ])
        setDomains(domainsRes.data)

        // Pre-select current interests by matching names
        const currentInterestNames = profileRes.data.interests || []
        const preSelected = domainsRes.data
          .filter((d) => currentInterestNames.includes(d.name))
          .map((d) => d.id)
        setSelected(preSelected)
      } catch (error) {
        toast.error('Failed to load interests')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleInterest = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (selected.length < MIN_INTERESTS) {
      toast.error(`Please select at least ${MIN_INTERESTS} interests`)
      return
    }

    setSaving(true)
    try {
      await saveInterests({ interest_ids: selected })
      toast.success('Interests updated successfully!')
      navigate('/profile')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update interests'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const icons = {
    'Computer Science':        '💻',
    'Artificial Intelligence': '🤖',
    'Machine Learning':        '🧠',
    'Data Science':            '📊',
    'Web Development':         '🌐',
    'Mobile Development':      '📱',
    'Cybersecurity':           '🔒',
    'Cloud Computing':         '☁️',
    'Software Engineering':    '⚙️',
    'Database Systems':        '🗄️',
    'Computer Networks':       '🌍',
    'Programming':             '💡',
    'DevOps':                  '🔧',
    'Blockchain':              '🔗',
    'Internet of Things':      '📡',
    'default':                 '📚',
  }

  if (loading) return <MainLayout><Loader /></MainLayout>

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">

        <h1 className="font-heading font-bold text-2xl text-white mb-2">Update Interests</h1>
        <p className="text-gray-400 text-sm mb-6">
          Select at least {MIN_INTERESTS} interests to get better recommendations
        </p>

        {/* Interest Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {domains.map((domain) => {
            const isSelected = selected.includes(domain.id)
            return (
              <button
                key={domain.id}
                onClick={() => toggleInterest(domain.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                <span className="text-3xl">{icons[domain.name] || icons['default']}</span>
                <span className="text-sm font-medium text-center leading-tight">{domain.name}</span>
                {isSelected && (
                  <span className="text-xs text-indigo-400 font-semibold">✓ Selected</span>
                )}
              </button>
            )
          })}
        </div>

        <p className={`text-sm mb-6 text-center ${
          selected.length >= MIN_INTERESTS ? 'text-green-400' : 'text-gray-500'
        }`}>
          {selected.length} of {MIN_INTERESTS} minimum selected
          {selected.length >= MIN_INTERESTS && ' ✓'}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 font-semibold rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selected.length < MIN_INTERESTS}
            className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {saving ? 'Saving...' : 'Save Interests'}
          </button>
        </div>

      </div>
    </MainLayout>
  )
}

export default UpdateInterestsPage
