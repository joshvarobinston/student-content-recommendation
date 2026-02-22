// layouts/Sidebar.jsx
// Left sidebar navigation

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  MdHome,
  MdVideoLibrary,
  MdMenuBook,
  MdArticle,
  MdNewspaper,
  MdFolder,
} from 'react-icons/md'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const currentType = searchParams.get('type')

  // Sidebar navigation items
  const navItems = [
    {
      label: 'Home',
      icon: <MdHome size={20} />,
      path: '/feed',
      type: null,
    },
    {
      label: 'Videos',
      icon: <MdVideoLibrary size={20} />,
      path: '/feed?type=video',
      type: 'video',
    },
    {
      label: 'Books',
      icon: <MdMenuBook size={20} />,
      path: '/feed?type=book',
      type: 'book',
    },
    {
      label: 'News',
      icon: <MdNewspaper size={20} />,
      path: '/feed?type=news',
      type: 'news',
    },
    {
      label: 'Articles',
      icon: <MdArticle size={20} />,
      path: '/feed?type=article',
      type: 'article',
    },
    {
      label: 'Library',
      icon: <MdFolder size={20} />,
      path: '/library',
      type: null,
    },
  ]

  // Check if a nav item is active
  const isActive = (item) => {
    if (item.path === '/library') {
      return location.pathname === '/library'
    }
    if (item.type === null && !currentType) {
      return location.pathname === '/feed'
    }
    return currentType === item.type
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-slate-100 flex flex-col py-4 z-30 overflow-y-auto">

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item)
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className={isActive(item) ? 'text-indigo-500' : 'text-slate-400'}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="mt-auto px-3 border-t border-slate-100 pt-4 flex flex-col gap-1">
        <button
          onClick={() => navigate('/saved-items')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
        >
          🔖 Saved Items
        </button>
        <button
          onClick={() => navigate('/liked-items')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
        >
          ❤️ Liked Items
        </button>
      </div>

    </aside>
  )
}

export default Sidebar