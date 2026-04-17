import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { searchContent } from '../api/contentApi'
import ArticleCard from '../components/cards/ArticleCard'
import BookCard from '../components/cards/BookCard'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import NewsCard from '../components/cards/NewsCard'
import VideoCard from '../components/cards/VideoCard'
import MainLayout from '../layouts/MainLayout'

const TAB_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Videos', value: 'video' },
  { label: 'News', value: 'news' },
  { label: 'Articles', value: 'article' },
  { label: 'Books', value: 'book' },
]

const SearchResultsPage = () => {
  const location = useLocation()
  const initialQuery = location.state?.query || ''
  const initialType = location.state?.type || 'all'

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState(initialType)

  useEffect(() => {
    setQuery(location.state?.query || '')
    setActiveType(location.state?.type || 'all')
  }, [location.state])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const runSearch = async () => {
      setLoading(true)
      try {
        const payload = { query: query.trim() }
        if (activeType !== 'all') {
          payload.type = activeType
        }

        const res = await searchContent(payload)
        setResults(res.data.results || res.data || [])
      } catch {
        toast.error('Search failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    runSearch()
  }, [query, activeType])

  const renderedTitle = useMemo(() => {
    if (activeType === 'all') return 'Search Results'
    const selectedTab = TAB_OPTIONS.find((tab) => tab.value === activeType)
    return `${selectedTab?.label || 'Search'} Results`
  }, [activeType])

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

  const getResultsContainerClass = () => {
    if (activeType === 'news' || activeType === 'article') {
      return 'flex flex-col gap-4'
    }
    return 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-slate-800 mb-1">{renderedTitle}</h1>
          {query && (
            <p className="text-slate-400 text-sm">
              Showing {activeType === 'all' ? 'results' : `${activeType} results`} for{' '}
              <span className="text-indigo-500 font-medium">"{query}"</span>
              {!loading && ` — ${results.length} items`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {TAB_OPTIONS.map((tab) => (
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

        {!query ? (
          <EmptyState icon="??" title="Search for something" message="Use the search bar above to find content in the current section." />
        ) : loading ? (
          <Loader />
        ) : results.length === 0 ? (
          <EmptyState icon="??" title="No results found" message={`No ${activeType === 'all' ? 'content' : activeType} results found for "${query}".`} />
        ) : (
          <div className={getResultsContainerClass()}>
            {results.map((content) => renderCard(content))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default SearchResultsPage
