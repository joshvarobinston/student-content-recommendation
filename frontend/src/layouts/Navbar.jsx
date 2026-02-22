// layouts/Navbar.jsx
// Top navigation bar with search and profile dropdown

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { recordSearch } from '../api/engagementApi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      // Record search query for ML
      await recordSearch({ query: query.trim() })
    } catch (error) {
      // Silently fail — search still works
    }

    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user?.email) return user.email[0].toUpperCase()
    return 'U'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 h-16 flex items-center px-6 gap-4">

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer flex-shrink-0"
        onClick={() => navigate('/feed')}
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <span className="font-heading font-bold text-lg text-slate-800 hidden sm:block">
          StudentReco
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos, news, books..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
        </div>
      </form>

      {/* Profile Dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm hover:bg-indigo-600 transition-colors"
        >
          {getInitials()}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-52 bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden z-50">

            {/* User Info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-800">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name}`
                  : 'Student'}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1.5">
              <button
                onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <FiUser size={15} />
                Profile
              </button>

              <button
                onClick={() => { navigate('/settings'); setDropdownOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <FiSettings size={15} />
                Settings
              </button>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
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