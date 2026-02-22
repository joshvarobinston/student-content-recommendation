// api/engagementApi.js
// User engagement tracking API calls

import axiosInstance from './axiosInstance'

// Record a content view
// data = { content_item_id, view_duration }
export const recordView = (data) =>
  axiosInstance.post('/api/engagement/views/create/', data)

// Toggle like on a content item
// data = { content_item_id }
export const toggleLike = (data) =>
  axiosInstance.post('/api/engagement/like/toggle/', data)

// Toggle save (bookmark) on a content item
// data = { content_item_id }
export const toggleSave = (data) =>
  axiosInstance.post('/api/engagement/saves/toggle/', data)

// Record a search query
// data = { query }
export const recordSearch = (data) =>
  axiosInstance.post('/api/engagement/searches/create/', data)