// pages/InterestSelectionPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getInterestDomains, saveInterests } from '../api/interestsApi'

const InterestSelectionPage = () => {
  const navigate = useNavigate()

  const [domains, setDomains] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load all interest domains on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await getInterestDomains()
        setDomains(res.data)
      } catch (error) {
        toast.error('Failed to load interests')
      } finally {
        setLoading(false)
      }
    }
    fetchDomains()
  }, [])

  // Toggle interest selection
  const toggleInterest = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  // Save selected interests
  const handleSave = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one interest')
      return
    }

    setSaving(true)
    try {
      await saveInterests({ interest_ids: selected })
      toast.success('Interests saved! Welcome to StudentReco!')
      navigate('/feed')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to save interests'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  // Interest icons map
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

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-white">
              S
            </div>
            <span className="font-heading font-bold text-2xl text-white">StudentReco</span>
          </div>
          <h1 className="font-heading font-bold text-3xl text-white mb-3">
            What are you interested in?
          </h1>
          <p className="text-white/50 text-base">
            Select your interests so we can personalize your content feed
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (

          <>
            {/* Interest Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
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
                    <span className="text-3xl">
                      {icons[domain.name] || icons.default}
                    </span>
                    <span className="text-sm font-medium text-center leading-tight">
                      {domain.name}
                    </span>
                    {isSelected && (
                      <span className="text-xs text-indigo-400 font-semibold">
                        ✓ Selected
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Selected Count */}
            <p className="text-center text-white/40 text-sm mb-6">
              {selected.length} interest{selected.length !== 1 ? 's' : ''} selected
            </p>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                disabled={saving || selected.length === 0}
                className="px-12 py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg"
              >
                {saving ? 'Saving...' : 'Continue to Feed →'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default InterestSelectionPage