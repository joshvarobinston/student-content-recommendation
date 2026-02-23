// pages/SavedItemsPage.jsx
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getSavedItems } from '../api/accountApi'
import MainLayout from '../layouts/MainLayout'
import VideoCard from '../components/cards/VideoCard'
import NewsCard from '../components/cards/NewsCard'
import ArticleCard from '../components/cards/ArticleCard'
import BookCard from '../components/cards/BookCard'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'

const SavedItemsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await getSavedItems()
        setItems(res.data)
      } catch (error) {
        toast.error('Failed to load saved items')
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [])

  const filtered = activeType === 'all'
    ? items
    : items.filter((i) => i.content_type === activeType)

  const renderCard = (content) => {
    switch (content.content_type) {
      case 'video': return <VideoCard key={content.id} content={content} />
      case 'news': return <NewsCard key={content.id} content={content} />
      case 'article': return <ArticleCard key={content.id} content={content} />
      case 'book': return <BookCard key={content.id} content={content} />
      default: return <NewsCard key={content.id} content={content} />
    }
  }

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
          <h1 className="font-heading font-bold text-2xl text-slate-800">🔖 Saved Items</h1>
          <p className="text-slate-400 text-sm mt-1">
            {!loading && `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Type Tabs */}
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

        {/* Content */}
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No saved items"
            message="Save content from your feed by clicking the bookmark icon."
          />
        ) : (
          <div className={
            activeType === 'news' || activeType === 'article'
              ? 'flex flex-col gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
          }>
            {filtered.map((content) => renderCard(content))}
          </div>
        )}

      </div>
    </MainLayout>
  )
}

export default SavedItemsPage