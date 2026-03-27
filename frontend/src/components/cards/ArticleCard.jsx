// components/cards/ArticleCard.jsx

import { useState } from 'react'
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { toggleLike, toggleSave, recordView } from '../../api/engagementApi'
import { formatDate } from '../../utils/formatDate'
import { toast } from 'react-toastify'

const ArticleCard = ({ content }) => {
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
      setLikesCount(liked ? likesCount - 1 : likesCount + 1) // ✅
    } catch (error) {
      toast.error('Failed to like content')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await toggleSave({ content_item_id: content.id })
      setSaved(!saved)
      setSavesCount(saved ? savesCount - 1 : savesCount + 1) // ✅
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 flex gap-4 p-4">

      {/* Thumbnail */}
      <div
        className="flex-shrink-0 w-28 h-24 rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
        onClick={handleView}
      >
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-50">
            <span className="text-3xl">📝</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Badge + Date */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-md">
            ARTICLE
          </span>
          <span className="text-xs text-slate-400">{formatDate(content.published_date)}</span>
        </div>

        {/* Title */}
        <h3
          className="font-heading font-semibold text-slate-800 text-sm leading-snug mb-1.5 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={handleView}
        >
          {content.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
          {content.description}
        </p>

        {/* Source + Actions */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium text-slate-500">{content.source_name}</span>

          <div className="flex items-center gap-3">

            {/* ✅ Like with count */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              {liked
                ? <FaHeart className="text-red-500" size={13} />
                : <FaRegHeart size={13} />
              }
              <span className="text-xs">{likesCount}</span>
            </button>

            {/* ✅ Save with count */}
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-slate-400 hover:text-indigo-500 transition-colors"
            >
              {saved
                ? <FaBookmark className="text-indigo-500" size={13} />
                : <FaRegBookmark size={13} />
              }
              <span className="text-xs">{savesCount}</span>
            </button>

            <button
              onClick={handleView}
              className="text-xs text-indigo-500 font-medium hover:underline"
            >
              Read More →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ArticleCard