// api/accountApi.js
// Account & profile related API calls

import axiosInstance from './axiosInstance'

// Get logged-in user profile
export const getProfile = () =>
  axiosInstance.get('/api/account/profile/')

// Update first name and last name
export const updateProfile = (data) =>
  axiosInstance.put('/api/account/update-profile/', data)

// Change password (old + new)
export const changePassword = (data) =>
  axiosInstance.post('/api/account/change-password/', data)

// Delete account permanently
export const deleteAccount = (data) =>
  axiosInstance.delete('/api/account/delete-account/', { data })

// Get all saved content items
export const getSavedItems = () =>
  axiosInstance.get('/api/account/saved-items/')

// Get all liked content items
export const getLikedItems = () =>
  axiosInstance.get('/api/account/liked-items/')