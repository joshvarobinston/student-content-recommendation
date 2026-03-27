// pages/FeedPage.jsx

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getFeed, refreshContent } from '../api/contentApi'
import MainLayout from '../layouts/MainLayout'
import VideoCard from '../components/cards/VideoCard'
import NewsCard from '../components/cards/NewsCard'
import ArticleCard from '../components/cards/ArticleCard'
import BookCard from '../components/cards/BookCard'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'

const FeedPage = () => {
  const [searchParams] = useSearchParams()
  const contentType = searchParams.get('type') || 'all'

  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('relevant')
  const [dateFilter, setDateFilter] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // ✅ FIXED: useCallback so fetchFeed is stable and safe in useEffect deps
  const fetchFeed = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        page,
        sort: sortBy,
      }
      if (dateFilter) params.date = dateFilter
      if (contentType !== 'all') params.content_type = contentType

      const res = await getFeed(params)
      setContents(res.data.results || [])
      setTotalPages(res.data.total_pages || 1)
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [contentType, sortBy, dateFilter])

  // ✅ FIXED: fetchFeed now in dependency array — no stale closure
  useEffect(() => {
    setCurrentPage(1)
    fetchFeed(1)
  }, [fetchFeed])

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

  const getTitle = () => {
    switch (contentType) {
      case 'video':   return '🎥 Videos'
      case 'news':    return '📰 News'
      case 'article': return '📝 Articles'
      case 'book':    return '📚 Books'
      default:        return '🏠 Your Feed'
    }
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="font-heading font-bold text-2xl text-slate-800">
            {getTitle()}
          </h1>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="relevant">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Anytime</option>
              <option value="24h">Last 24 Hours</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-all"
            >
              {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
            </button>

          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : contents.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No content found"
            message="Try changing your filters or refresh to load new content."
          />
        ) : (
          <>
            <div className={
              contentType === 'news' || contentType === 'article'
                ? 'flex flex-col gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            }>
              {contents.map((content) => renderCard(content))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

      </div>
    </MainLayout>
  )
}

export default FeedPage
