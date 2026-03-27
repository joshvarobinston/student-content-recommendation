// components/cards/VideoCard.jsx
// YouTube style video card component

import { useState } from 'react'
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { toggleLike, toggleSave, recordView } from '../../api/engagementApi'
import { formatDate } from '../../utils/formatDate'
import { toast } from 'react-toastify'

const VideoCard = ({ content }) => {
  // ✅ Initialize from backend data
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
    } catch (error) {
      toast.error('Failed to like content')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await toggleSave({ content_item_id: content.id })
      setSaved(!saved)
      setSavesCount(saved ? savesCount - 1 : savesCount + 1)
    } catch (error) {
      toast.error('Failed to save content')
    }
  }

  const handleView = async () => {
    try {
      await recordView({ content_item_id: content.id, view_duration: 0 })
      window.open(content.source_url, '_blank')
    } catch (error) {
      window.open(content.source_url, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">

      {/* Thumbnail */}
      <div
        className="relative w-full h-44 bg-slate-100 cursor-pointer overflow-hidden"
        onClick={handleView}
      >
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50">
            <span className="text-4xl">🎥</span>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
          VIDEO
        </span>
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Title */}
        <h3
          className="font-heading font-semibold text-slate-800 text-sm leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={handleView}
        >
          {content.title}
        </h3>

        {/* Source + Date */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-medium text-slate-500">{content.source_name}</span>
          <span>{formatDate(content.published_date)}</span>
        </div>

        {/* ✅ Like + Save with counts */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            {liked
              ? <FaHeart className="text-red-500" size={14} />
              : <FaRegHeart size={14} />
            }
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-500 transition-colors"
          >
            {saved
              ? <FaBookmark className="text-indigo-500" size={14} />
              : <FaRegBookmark size={14} />
            }
            <span>{savesCount}</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default VideoCard