import { useState } from 'react'
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { toggleLike, toggleSave, recordView } from '../../api/engagementApi'
import { formatDate } from '../../utils/formatDate'
import CardThumbnail from './CardThumbnail'

const ArticleCard = ({ content }) => {
  const [liked, setLiked] = useState(content.is_liked || false)
  const [saved, setSaved] = useState(content.is_saved || false)
  const [likesCount, setLikesCount] = useState(content.likes_count || 0)
  const [savesCount, setSavesCount] = useState(content.saves_count || 0)

  const handleLike = async (e) => {
    e.preventDefault()
    try {
      await toggleLike({ content_item_id: content.id })
      setLiked(!liked)
      setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    } catch {
      toast.error('Failed to like content')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await toggleSave({ content_item_id: content.id })
      setSaved(!saved)
      setSavesCount(saved ? savesCount - 1 : savesCount + 1)
    } catch {
      toast.error('Failed to save content')
    }
  }

  const handleView = async () => {
    try {
      await recordView({ content_item_id: content.id, view_duration: 0 })
    } finally {
      window.open(content.source_url, '_blank')
    }
  }

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 flex gap-4 p-4 min-h-[170px]">
      <CardThumbnail
        src={content.thumbnail_url}
        alt={content.title}
        onClick={handleView}
        className="flex-shrink-0 w-28 h-24 rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
        imageClassName="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-600 font-semibold text-xs tracking-[0.2em]">
            ARTICLE
          </div>
        }
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5 gap-3">
          <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-md shrink-0">
            ARTICLE
          </span>
          <span className="text-xs text-slate-400">{formatDate(content.published_date)}</span>
        </div>

        <h3 className="font-heading font-semibold text-slate-800 text-sm leading-snug mb-1.5 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={handleView}>
          {content.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
          {content.description}
        </p>

        <div className="flex items-center justify-between mt-auto gap-3">
          <span className="text-xs font-medium text-slate-500 truncate">{content.source_name}</span>

          <div className="flex items-center gap-3 shrink-0">
            <button onClick={handleLike} className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors">
              {liked ? <FaHeart className="text-red-500" size={13} /> : <FaRegHeart size={13} />}
              <span className="text-xs">{likesCount}</span>
            </button>

            <button onClick={handleSave} className="flex items-center gap-1 text-slate-400 hover:text-indigo-500 transition-colors">
              {saved ? <FaBookmark className="text-indigo-500" size={13} /> : <FaRegBookmark size={13} />}
              <span className="text-xs">{savesCount}</span>
            </button>

            <button onClick={handleView} className="text-xs text-indigo-500 font-medium hover:underline">
              Read More ?
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard
