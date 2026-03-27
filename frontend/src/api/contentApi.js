// api/contentApi.js

import axiosInstance from './axiosInstance'

// ✅ FIXED: params must be wrapped in { params } for GET requests
// Previously: axiosInstance.get(url, data) → params were ignored
// Correct:    axiosInstance.get(url, { params: data }) → params sent as query string
export const getFeed = (data = {}) =>
  axiosInstance.get('/api/content/personalized-recommendations/', { params: data })

// Search content — POST with body
export const searchContent = (data) =>
  axiosInstance.post('/api/content/search/', data)

// Force refresh content from external APIs
export const refreshContent = () =>
  axiosInstance.post('/api/content/refresh/')
