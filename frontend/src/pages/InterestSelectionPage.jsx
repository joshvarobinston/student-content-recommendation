// pages/InterestSelectionPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getInterestDomains, saveInterests } from '../api/interestsApi'

const MIN_INTERESTS = 3

const InterestSelectionPage = () => {
  const navigate = useNavigate()

  const [domains, setDomains] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

  const toggleInterest = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (selected.length < MIN_INTERESTS) {   // ✅ Min 3 enforced
      toast.error(`Please select at least ${MIN_INTERESTS} interests`)
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

  const icons = {
    default: '📚',
    'Computer Science': '💻',
    'Artificial Intelligence': '🤖',
    'Machine Learning': '🧠',
    'Data Science': '📊',
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Cybersecurity': '🔒',
    'Cloud Computing': '☁️',
    'Software Engineering': '⚙️',
    'Database Systems': '🗄️',
    'Computer Networks': '🌍',
    'Programming': '💡',
    'DevOps': '🔧',
    'Blockchain': '🔗',
    'Internet of Things': '📡',
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
            Select at least {MIN_INTERESTS} interests to personalize your feed
          </p>
        </div>

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
                      <span className="text-xs text-indigo-400 font-semibold">✓ Selected</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Selected Count */}
            <p className={`text-center text-sm mb-6 ${
              selected.length >= MIN_INTERESTS ? 'text-green-400' : 'text-white/40'
            }`}>
              {selected.length} of {MIN_INTERESTS} minimum selected
              {selected.length >= MIN_INTERESTS && ' ✓'}
            </p>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                disabled={saving || selected.length < MIN_INTERESTS}  // ✅ Disabled until 3 selected
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