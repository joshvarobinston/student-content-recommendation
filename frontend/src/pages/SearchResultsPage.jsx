// pages/SearchResultsPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { searchContent } from '../api/contentApi'
import { recordSearch } from '../api/engagementApi'
import MainLayout from '../layouts/MainLayout'
import VideoCard from '../components/cards/VideoCard'
import NewsCard from '../components/cards/NewsCard'
import ArticleCard from '../components/cards/ArticleCard'
import BookCard from '../components/cards/BookCard'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState('all')

  // Search whenever query changes
  useEffect(() => {
    if (query.trim()) {
      handleSearch(query)
    }
  }, [query])

  const handleSearch = async (q) => {
    setLoading(true)
    try {
      // Record search for ML
      await recordSearch({ query: q })
    } catch (error) {
      // Silently fail
    }

    try {
      const res = await searchContent({ query: q })
      setResults(res.data.results || res.data)
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter by content type
  const filteredResults = activeType === 'all'
    ? results
    : results.filter((r) => r.content_type === activeType)

  // Render correct card
  const renderCard = (content) => {
    switch (content.content_type) {
      case 'video': return <VideoCard key={content.id} content={content} />
      case 'news': return <NewsCard key={content.id} content={content} />
      case 'article': return <ArticleCard key={content.id} content={content} />
      case 'book': return <BookCard key={content.id} content={content} />
      default: return <NewsCard key={content.id} content={content} />
    }
  }

  // Type filter tabs
  const tabs = [
    { label: 'All', value: 'all' },
    { label: '🎥 Videos', value: 'video' },
    { label: '📰 News', value: 'news' },
    { label: '📝 Articles', value: 'article' },
    { label: '📚 Books', value: 'book' },
  ]

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-slate-800 mb-1">
            Search Results
          </h1>
          {query && (
            <p className="text-slate-400 text-sm">
              Showing results for{' '}
              <span className="text-indigo-500 font-medium">"{query}"</span>
              {!loading && ` — ${filteredResults.length} results`}
            </p>
          )}
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveType(tab.value)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                activeType === tab.value
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {!query ? (
          <EmptyState
            icon="🔍"
            title="Search for something"
            message="Type in the search bar above to find content."
          />
        ) : loading ? (
          <Loader />
        ) : filteredResults.length === 0 ? (
          <EmptyState
            icon="😕"
            title="No results found"
            message={`No content found for "${query}". Try different keywords.`}
          />
        ) : (
          <div className={
            activeType === 'news' || activeType === 'article'
              ? 'flex flex-col gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
          }>
            {filteredResults.map((content) => renderCard(content))}
          </div>
        )}

      </div>
    </MainLayout>
  )
}

export default SearchResultsPage