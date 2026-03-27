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
  const { id } = useParams()   // ✅ Fixed — route is /library/:id
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [folderName, setFolderName] = useState('Folder')
  const [folderDescription, setFolderDescription] = useState('')
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [id])

  const fetchItems = async () => {
    try {
      const res = await getFolderItems(id)
      setItems(res.data.items || res.data)
      if (res.data.folder_name) setFolderName(res.data.folder_name)
      if (res.data.description) setFolderDescription(res.data.description)
    } catch (error) {
      toast.error('Failed to load folder items')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId) => {
    setRemovingId(itemId)
    try {
      await removeItemFromFolder(itemId)
      setItems(items.filter((i) => i.id !== itemId))
      toast.success('Item removed from folder')
    } catch (error) {
      toast.error('Failed to remove item')
    } finally {
      setRemovingId(null)
    }
  }

  const renderCard = (item) => {
    const content = item.content_item || item
    switch (content.content_type) {
      case 'video':   return <VideoCard   key={item.id} content={content} />
      case 'news':    return <NewsCard    key={item.id} content={content} />
      case 'article': return <ArticleCard key={item.id} content={content} />
      case 'book':    return <BookCard    key={item.id} content={content} />
      default:        return <NewsCard    key={item.id} content={content} />
    }
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
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
        {folderDescription && (
          <p className="text-slate-400 text-sm mb-6 ml-1">{folderDescription}</p>
        )}

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
          <div className="flex flex-col gap-6 mt-6">
            {items.map((item) => (
              <div key={item.id} className="relative">
                {renderCard(item)}
                {/* ✅ Remove button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removingId === item.id}
                  className="absolute top-2 right-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 border border-red-100"
                >
                  {removingId === item.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  )
}

export default FolderDetailPage