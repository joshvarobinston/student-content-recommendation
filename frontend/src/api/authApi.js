// api/authApi.js
// Authentication API calls — signup, login, password reset

import axiosInstance from './axiosInstance'

// Register new user
export const signup = (data) =>
  axiosInstance.post('/api/auth/signup/', data)

// Login and get JWT tokens
export const login = (data) =>
  axiosInstance.post('/api/auth/login/', data)

// Generate password reset token
export const forgotPassword = (data) =>
  axiosInstance.post('/api/auth/forgot-password/', data)

// Reset password using token
export const resetPassword = (data) =>
  axiosInstance.post('/api/auth/reset-password/', data)