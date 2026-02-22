// api/libraryApi.js
// Library folders and items API calls

import axiosInstance from './axiosInstance'

// Get all user folders
export const getFolders = () =>
  axiosInstance.get('/api/library/folders/')

// Create a new study folder
// data = { name, description }
export const createFolder = (data) =>
  axiosInstance.post('/api/library/folders/create/', data)

// Delete a folder by ID
export const deleteFolder = (folderId) =>
  axiosInstance.delete(`/api/library/folders/${folderId}/delete/`)

// Get all items inside a folder
export const getFolderItems = (folderId) =>
  axiosInstance.get(`/api/library/folders/${folderId}/items/`)

// Add a content item to a folder
// data = { content_item_id }
export const addItemToFolder = (folderId, data) =>
  axiosInstance.post(`/api/library/folders/${folderId}/add-item/`, data)

// Remove an item from a folder
export const removeItemFromFolder = (itemId) =>
  axiosInstance.delete(`/api/library/items/${itemId}/delete/`)