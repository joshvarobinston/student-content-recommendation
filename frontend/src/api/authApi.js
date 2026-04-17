import axiosInstance from './axiosInstance'

export const signup = (data) =>
  axiosInstance.post('/api/auth/signup/', data)

export const login = (data) =>
  axiosInstance.post('/api/auth/login/', data)

export const verifyOtp = (data) =>
  axiosInstance.post('/api/auth/verify-otp/', data)

export const resendOtp = (data) =>
  axiosInstance.post('/api/auth/resend-otp/', data)

export const forgotPassword = (data) =>
  axiosInstance.post('/api/auth/forgot-password/', data)

export const resetPassword = (data) =>
  axiosInstance.post('/api/auth/reset-password/', data)
