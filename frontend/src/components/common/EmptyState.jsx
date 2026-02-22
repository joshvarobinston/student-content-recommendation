// components/common/EmptyState.jsx
// Reusable empty state component when no data is found

const EmptyState = ({ icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-20 text-center">
      {/* Icon */}
      <div className="text-6xl mb-4">{icon || '📭'}</div>

      {/* Title */}
      <h3 className="font-heading font-semibold text-xl text-slate-700 mb-2">
        {title || 'Nothing here yet'}
      </h3>

      {/* Message */}
      <p className="text-slate-400 text-sm max-w-sm">
        {message || 'No content found.'}
      </p>
    </div>
  )
}

export default EmptyState