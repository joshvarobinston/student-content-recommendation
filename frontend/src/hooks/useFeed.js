// hooks/useFeed.js
// ✅ FIXED: This hook is now clean and actually used by FeedPage
// Previously FeedPage had its own duplicate state — now unified here

import { useState, useCallback } from 'react'
import { getFeed, refreshContent } from '../api/contentApi'

const useFeed = () => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    next: null,
    previous: null,
  })

  const fetchFeed = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getFeed(filters)
      setContents(res.data.results || [])
      setPagination({
        count: res.data.count,
        totalPages: res.data.total_pages,
        currentPage: res.data.current_page,
        next: res.data.next,
        previous: res.data.previous,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      await refreshContent()
      await fetchFeed(filters)
    } catch (err) {
      setError('Failed to refresh content')
    } finally {
      setLoading(false)
    }
  }, [fetchFeed])

  return {
    contents,
    loading,
    error,
    pagination,
    fetchFeed,
    refresh,
  }
}

export default useFeed
