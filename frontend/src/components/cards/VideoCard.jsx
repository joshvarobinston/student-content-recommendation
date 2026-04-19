import { useState } from 'react'
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { toggleLike, toggleSave, recordView } from '../../api/engagementApi'
import { formatDate } from '../../utils/formatDate'
import CardThumbnail from './CardThumbnail'

const VideoCard = ({ content }) => {
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
    <article className="bg-[#1e2535] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-200">
      <div className="relative">
        <CardThumbnail
          src={content.thumbnail_url}
          alt={content.title}
          onClick={handleView}
          className="w-full h-44 bg-slate-100 cursor-pointer overflow-hidden"
          imageClassName="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-indigo-900/40 text-indigo-400 font-semibold tracking-[0.2em] text-sm">
              VIDEO
            </div>
          }
        />
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
          VIDEO
        </span>
      </div>

      <div className="p-4">
        <h3
          className="font-heading font-semibold text-white text-sm leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-indigo-400 transition-colors min-h-[2.75rem]"
          onClick={handleView}
        >
          {content.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 gap-3">
          <span className="font-medium text-gray-400 truncate">{content.source_name}</span>
          <span className="shrink-0 text-gray-500">{formatDate(content.published_date)}</span>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            {liked ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart size={14} />}
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
          >
            {saved ? <FaBookmark className="text-indigo-500" size={14} /> : <FaRegBookmark size={14} />}
            <span>{savesCount}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default VideoCard
