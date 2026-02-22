// components/cards/BookCard.jsx
// Book cover style card component

import { useState } from 'react'
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { toggleLike, toggleSave, recordView } from '../../api/engagementApi'
import { formatYear } from '../../utils/formatDate'
import { toast } from 'react-toastify'

const BookCard = ({ content }) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleLike = async (e) => {
    e.preventDefault()
    try {
      await toggleLike({ content_item_id: content.id })
      setLiked(!liked)
    } catch (error) {
      toast.error('Failed to like content')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await toggleSave({ content_item_id: content.id })
      setSaved(!saved)
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

      {/* Book Cover */}
      <div
        className="relative w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 cursor-pointer overflow-hidden"
        onClick={handleView}
      >
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">📚</span>
          </div>
        )}

        {/* Book badge */}
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
          BOOK
        </span>
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Title */}
        <h3
          className="font-heading font-semibold text-slate-800 text-sm leading-snug mb-1 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={handleView}
        >
          {content.title}
        </h3>

        {/* Source + Year */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium text-slate-500">{content.source_name}</span>
          <span>{formatYear(content.published_date)}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {content.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              {liked ? (
                <FaHeart className="text-red-500" size={13} />
              ) : (
                <FaRegHeart size={13} />
              )}
              Like
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-500 transition-colors"
            >
              {saved ? (
                <FaBookmark className="text-indigo-500" size={13} />
              ) : (
                <FaRegBookmark size={13} />
              )}
              Save
            </button>
          </div>

          <button
            onClick={handleView}
            className="text-xs text-indigo-500 font-medium hover:underline"
          >
            View Full →
          </button>
        </div>

      </div>
    </div>
  )
}

export default BookCard