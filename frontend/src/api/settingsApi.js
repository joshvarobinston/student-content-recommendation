// api/settingsApi.js
// User settings API calls

import axiosInstance from './axiosInstance'

// Get current user settings
export const getSettings = () =>
  axiosInstance.get('/api/settings/user-settings/')

// Update user settings
// data = { theme, items_per_page, show_thumbnails, ... }
export const updateSettings = (data) =>
  axiosInstance.put('/api/settings/user-settings/', data)