// pages/FeedPage.jsx

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getFeed, refreshContent } from '../api/contentApi'
import { getProfile } from '../api/accountApi'
import { getSavedItems } from '../api/accountApi'
import { toggleSave, toggleLike, recordView } from '../api/engagementApi'
import MainLayout from '../layouts/MainLayout'
import VideoCard from '../components/cards/VideoCard'
import NewsCard from '../components/cards/NewsCard'
import ArticleCard from '../components/cards/ArticleCard'
import BookCard from '../components/cards/BookCard'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'

// ---- Icons ----
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8 5v14l11-7z" /></svg>
)
const ArticleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M4 4h16v4H4zM4 12h10M4 16h8" strokeLinecap="round" />
  </svg>
)
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" />
  </svg>
)
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ---- Type Badge ----
const TypeBadge = ({ type }) => {
  const colors = {
    video:   'text-green-400 bg-green-400/10',
    news:    'text-blue-400 bg-blue-400/10',
    article: 'text-blue-400 bg-blue-400/10',
    book:    'text-green-400 bg-green-400/10',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors[type] || 'text-gray-400 bg-gray-400/10'}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}

// ---- Thumbnail Icon ----
const ThumbnailIcon = ({ type }) => {
  const base = 'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0'
  if (type === 'video') return <div className={`${base} bg-gray-700 text-white`}><PlayIcon /></div>
  if (type === 'book')  return <div className={`${base} bg-gray-700 text-blue-300`}><BookIcon /></div>
  return <div className={`${base} bg-gray-700 text-gray-300`}><ArticleIcon /></div>
}

// ---- Stat Card ----
const StatCard = ({ label, value }) => (
  <div className="bg-[#1e2535] rounded-xl p-4 flex flex-col gap-1 flex-1 min-w-[130px]">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-3xl font-bold text-white">{value ?? '—'}</span>
  </div>
)

// ---- Nav Button ----
const NavBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 px-4 py-3 bg-[#1e2535] hover:bg-[#2a3347] border border-white/5 text-white font-semibold rounded-xl transition-all text-sm"
  >
    {label}
  </button>
)

// ---- Content Row Card (Home only) ----
const ContentRow = ({ content, onLike, likedIds, savedIds, onSave }) => {
  const isLiked = likedIds.has(content.id)
  const isSaved = savedIds.has(content.id)
  const isBook  = content.content_type === 'book'

  const meta = [
    content.source_name,
    content.content_type === 'video' ? content.duration : content.read_time ? `${content.read_time} min read` : null,
    content.domain || content.category,
  ].filter(Boolean).join(' · ')

  return (
    <div
      className="flex items-center gap-4 bg-[#1e2535] hover:bg-[#232d40] border border-white/5 rounded-xl px-4 py-3 transition-all cursor-pointer group"
      onClick={() => { if (content.url || content.source_url) window.open(content.url || content.source_url, '_blank') }}
    >
      <ThumbnailIcon type={content.content_type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors line-clamp-1">
            {content.title}
          </span>
          <TypeBadge type={content.content_type} />
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{meta}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onLike(content.id)}
          className={`p-1.5 rounded-lg transition-all ${isLiked ? 'text-red-400 bg-red-400/10' : 'text-gray-500 hover:text-red-400 hover:bg-red-400/10'}`}
          title="Like"
        >
          <HeartIcon filled={isLiked} />
        </button>
        {isBook && (
          <button
            onClick={() => onSave(content.id)}
            className={`p-1.5 rounded-lg border transition-all ${isSaved ? 'border-indigo-400 text-indigo-400 bg-indigo-400/10' : 'border-white/10 text-gray-400 hover:border-indigo-400 hover:text-indigo-300'}`}
            title="Save"
          >
            <DownloadIcon />
          </button>
        )}
      </div>
    </div>
  )
}

// =============================================
// HOME DASHBOARD VIEW
// =============================================
const HomeDashboard = () => {
  const navigate = useNavigate()
  const [profile, setProfile]       = useState(null)
  const [contents, setContents]     = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [loading, setLoading]       = useState(true)
  const [likedIds, setLikedIds]     = useState(new Set())
  const [savedIds, setSavedIds]     = useState(new Set())
  const [sortBy, setSortBy]         = useState('relevant')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [profileRes, feedRes, savedRes] = await Promise.allSettled([
        getProfile(),
        getFeed({ sort: sortBy }),
        getSavedItems(),
      ])
      if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data)
      if (feedRes.status === 'fulfilled')    setContents(feedRes.value.data.results || [])
      if (savedRes.status === 'fulfilled') {
        const items = savedRes.value.data || []
        setSavedItems(items)
        setSavedIds(new Set(items.map(i => i.id)))
      }
    } catch {
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleLike = async (id) => {
    try {
      await toggleLike({ content_item_id: id })
      setLikedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    } catch { toast.error('Failed to like') }
  }

  const handleSave = async (id) => {
    try {
      await toggleSave({ content_item_id: id })
      setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    } catch { toast.error('Failed to save') }
  }

  const firstName    = profile?.first_name || profile?.username || 'Student'
  const interestCount  = profile?.interests?.length ?? 0
  const recommendCount = contents.length
  const savedCount     = savedItems.length
  const viewedToday    = profile?.viewed_today ?? 0

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {/* Welcome Banner */}
      <div className="rounded-2xl px-6 py-5" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2a4a7f 100%)' }}>
        <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}!</h1>
        <p className="text-blue-200 text-sm mt-1">Here's your personalised learning feed for today</p>
      </div>

      {/* Stats Row */}
      {loading ? <Loader /> : (
        <div className="flex gap-3 flex-wrap">
          <StatCard label="Recommendations" value={recommendCount} />
          <StatCard label="Saved items"      value={savedCount} />
          <StatCard label="Interests"        value={interestCount} />
          <StatCard label="Viewed today"     value={viewedToday} />
        </div>
      )}

      {/* Nav Buttons */}
      <div className="flex gap-3 flex-wrap">
        <NavBtn label="Browse all"   onClick={() => navigate('/feed?type=video')} />
        <NavBtn label="Saved items"  onClick={() => navigate('/saved')} />
        <NavBtn label="My interests" onClick={() => navigate('/interests/update')} />
        <NavBtn label="Profile"      onClick={() => navigate('/profile')} />
      </div>

      {/* Sort + Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm">Recommended for you</h2>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#1e2535] border border-white/10 text-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="relevant">Most Relevant</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Content List */}
      {loading ? <Loader /> : contents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold text-white">No content yet</p>
          <p className="text-sm mt-1">Try selecting more interests or check back later.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {contents.slice(0, 20).map(content => (
            <ContentRow
              key={content.id}
              content={content}
              likedIds={likedIds}
              savedIds={savedIds}
              onLike={handleLike}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================
// TYPED FEED VIEW (Videos / Books / News / Articles)
// =============================================
const TypedFeed = ({ contentType }) => {
  const [contents, setContents]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages]   = useState(1)
  const [sortBy, setSortBy]           = useState('relevant')
  const [dateFilter, setDateFilter]   = useState('')
  const [refreshing, setRefreshing]   = useState(false)

  const fetchFeed = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, sort: sortBy }
      if (dateFilter)  params.date = dateFilter
      if (contentType !== 'all') params.content_type = contentType
      const res = await getFeed(params)
      setContents(res.data.results || [])
      setTotalPages(res.data.total_pages || 1)
    } catch {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [contentType, sortBy, dateFilter])

  useEffect(() => { setCurrentPage(1); fetchFeed(1) }, [fetchFeed])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchFeed(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshContent()
      await fetchFeed(1)
      setCurrentPage(1)
      toast.success('Feed refreshed!')
    } catch {
      toast.error('Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }

  const renderCard = (content) => {
    switch (content.content_type) {
      case 'video':   return <VideoCard   key={content.id} content={content} />
      case 'news':    return <NewsCard    key={content.id} content={content} />
      case 'article': return <ArticleCard key={content.id} content={content} />
      case 'book':    return <BookCard    key={content.id} content={content} />
      default:        return <NewsCard    key={content.id} content={content} />
    }
  }

  const titles = { video: '🎥 Videos', news: '📰 News', article: '📝 Articles', book: '📚 Books', all: '🏠 All Content' }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-heading font-bold text-2xl text-white">{titles[contentType] || '🏠 Feed'}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm bg-[#1e2535] border border-white/10 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="relevant">Most Relevant</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-[#1e2535] border border-white/10 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Anytime</option>
            <option value="24h">Last 24 Hours</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-all"
          >
            {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <Loader />
      ) : contents.length === 0 ? (
        <EmptyState icon="📭" title="No content found" message="Try changing your filters or refresh." />
      ) : (
        <>
          <div className={
            contentType === 'news' || contentType === 'article'
              ? 'flex flex-col gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
          }>
            {contents.map(renderCard)}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}

// =============================================
// MAIN FeedPage — Routes to correct view
// =============================================
const FeedPage = () => {
  const [searchParams] = useSearchParams()
  const contentType = searchParams.get('type')

  return (
    <MainLayout>
      {!contentType
        ? <HomeDashboard />
        : <TypedFeed contentType={contentType} />
      }
    </MainLayout>
  )
}

export default FeedPage
