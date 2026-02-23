// pages/FolderDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getFolderItems, removeItemFromFolder } from '../api/libraryApi'
import MainLayout from '../layouts/MainLayout'
import VideoCard from '../components/cards/VideoCard'
import NewsCard from '../components/cards/NewsCard'
import ArticleCard from '../components/cards/ArticleCard'
import BookCard from '../components/cards/BookCard'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'

const FolderDetailPage = () => {
  const { folderId } = useParams()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [folderName, setFolderName] = useState('Folder')

  useEffect(() => {
    fetchItems()
  }, [folderId])

  const fetchItems = async () => {
    try {
      const res = await getFolderItems(folderId)
      setItems(res.data.items || res.data)
      if (res.data.folder_name) setFolderName(res.data.folder_name)
    } catch (error) {
      toast.error('Failed to load folder items')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await removeItemFromFolder(itemId)
      setItems(items.filter((i) => i.id !== itemId))
      toast.success('Item removed from folder')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const renderCard = (item) => {
    const content = item.content_item || item
    switch (content.content_type) {
      case 'video': return <VideoCard key={item.id} content={content} />
      case 'news': return <NewsCard key={item.id} content={content} />
      case 'article': return <ArticleCard key={item.id} content={content} />
      case 'book': return <BookCard key={item.id} content={content} />
      default: return <NewsCard key={item.id} content={content} />
    }
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/library')}
            className="text-slate-400 hover:text-slate-600 transition-colors text-sm"
          >
            ← Library
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="font-heading font-bold text-2xl text-slate-800">
            📁 {folderName}
          </h1>
        </div>

        {/* Items */}
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState
            icon="📂"
            title="Folder is empty"
            message="Save content to this folder from your feed."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => renderCard(item))}
          </div>
        )}

      </div>
    </MainLayout>
  )
}

export default FolderDetailPage