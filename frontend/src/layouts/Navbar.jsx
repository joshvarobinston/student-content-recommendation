import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { FiLogOut, FiSearch, FiSettings, FiUser } from 'react-icons/fi'

import { recordSearch } from '../api/engagementApi'
import { useAuth } from '../context/AuthContext'

const SEARCH_SCOPES = new Set(['video', 'book', 'news', 'article'])

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentType = searchParams.get('type')
  const activeSearchType = SEARCH_SCOPES.has(currentType) ? currentType : 'all'

  const handleSearch = async (e) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    try {
      await recordSearch({ query: trimmedQuery })
    } catch {
      // Search should still work even if tracking fails.
    }

    navigate('/search', {
      state: {
        query: trimmedQuery,
        type: activeSearchType,
        origin: location.pathname,
      },
    })
    setQuery('')
  }

  const getSearchPlaceholder = () => {
    switch (activeSearchType) {
      case 'video':
        return 'Search videos in this section...'
      case 'book':
        return 'Search books in this section...'
      case 'news':
        return 'Search news in this section...'
      case 'article':
        return 'Search articles in this section...'
      default:
        return 'Search videos, news, books...'
    }
  }

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user?.email) return user.email[0].toUpperCase()
    return 'U'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#131b2e] border-b border-white/10 h-16 flex items-center px-6 gap-4">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/feed')}>
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <span className="font-heading font-bold text-lg text-white hidden sm:block">
          StudentReco
        </span>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 text-white rounded-xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
        </div>
      </form>

      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm hover:bg-indigo-600 transition-colors"
        >
          {getInitials()}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-52 bg-[#1e2535] border border-white/10 rounded-2xl shadow-lg overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="font-semibold text-sm text-white">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : 'Student'}
              </p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>

            <div className="py-1.5">
              <button
                onClick={() => {
                  navigate('/profile')
                  setDropdownOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
              >
                <FiUser size={15} />
                Profile
              </button>

              <button
                onClick={() => {
                  navigate('/settings')
                  setDropdownOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
              >
                <FiSettings size={15} />
                Settings
              </button>

              <div className="border-t border-white/10 mt-1 pt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
