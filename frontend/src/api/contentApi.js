// api/contentApi.js
// Content feed and search API calls

import axiosInstance from './axiosInstance'

// Get personalized ML recommendations
// params = { type, sort, date, page }
export const getFeed = (params) =>
  axiosInstance.get('/api/content/personalized-recommendations/', { params })

// Search content across all types
// data = { query: "machine learning" }
export const searchContent = (data) =>
  axiosInstance.post('/api/content/search/', data)