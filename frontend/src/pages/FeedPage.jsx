// pages/FeedPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getFeed } from '../api/contentApi'
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

  // Fetch feed whenever filters change
  useEffect(() => {
    fetchFeed(1)
    setCurrentPage(1)
  }, [contentType, sortBy, dateFilter])

  const fetchFeed = async (page) => {
    setLoading(true)
    try {
      const params = {
        page,
        sort: sortBy,
        date: dateFilter,
      }
      if (contentType !== 'all') params.type = contentType

      const res = await getFeed(params)
      setContents(res.data.results || res.data)
      setTotalPages(res.data.total_pages || 1)
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchFeed(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Render correct card based on content type
  const renderCard = (content) => {
    switch (content.content_type) {
      case 'video':
        return <VideoCard key={content.id} content={content} />
      case 'news':
        return <NewsCard key={content.id} content={content} />
      case 'article':
        return <ArticleCard key={content.id} content={content} />
      case 'book':
        return <BookCard key={content.id} content={content} />
      default:
        return <NewsCard key={content.id} content={content} />
    }
  }

  // Page title based on content type
  const getTitle = () => {
    switch (contentType) {
      case 'video': return '🎥 Videos'
      case 'news': return '📰 News'
      case 'article': return '📝 Articles'
      case 'book': return '📚 Books'
      default: return '🏠 Your Feed'
    }
  }

  // Check if video or book type for grid layout
  const isGridLayout = contentType === 'video' || contentType === 'book' || contentType === 'all'

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

          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : contents.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No content found"
            message="Try changing your filters or update your interests."
          />
        ) : (
          <>
            {/* Grid for videos/books, List for news/articles */}
            <div className={
              contentType === 'news' || contentType === 'article'
                ? 'flex flex-col gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            }>
              {contents.map((content) => renderCard(content))}
            </div>

            {/* Pagination */}
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