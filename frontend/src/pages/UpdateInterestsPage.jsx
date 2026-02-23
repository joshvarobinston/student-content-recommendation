// pages/UpdateInterestsPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getInterestDomains, saveInterests } from '../api/interestsApi'
import { getProfile } from '../api/accountApi'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'

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
    if (selected.length === 0) {
      toast.error('Please select at least one interest')
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
    default: '📚',
    'Computer Science': '💻',
    'Medical': '🏥',
    'Business': '💼',
    'Engineering': '⚙️',
    'Mathematics': '📐',
    'Physics': '🔭',
    'Chemistry': '🧪',
    'Biology': '🧬',
    'History': '🏛️',
    'Literature': '📖',
    'Arts': '🎨',
    'Music': '🎵',
    'Psychology': '🧠',
    'Law': '⚖️',
    'Economics': '📈',
  }

  if (loading) return <MainLayout><Loader /></MainLayout>

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">

        <h1 className="font-heading font-bold text-2xl text-slate-800 mb-2">Update Interests</h1>
        <p className="text-slate-400 text-sm mb-6">
          Update your interests to get better recommendations
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
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200'
                }`}
              >
                <span className="text-3xl">{icons[domain.name] || icons.default}</span>
                <span className="text-sm font-medium text-center">{domain.name}</span>
                {isSelected && (
                  <span className="text-xs text-indigo-500 font-semibold">✓ Selected</span>
                )}
              </button>
            )
          })}
        </div>

        <p className="text-slate-400 text-sm mb-6 text-center">
          {selected.length} interest{selected.length !== 1 ? 's' : ''} selected
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {saving ? 'Saving...' : 'Save Interests'}
          </button>
        </div>

      </div>
    </MainLayout>
  )
}

export default UpdateInterestsPage