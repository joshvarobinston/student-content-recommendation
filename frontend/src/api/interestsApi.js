// api/interestsApi.js
// Interest domain API calls

import axiosInstance from './axiosInstance'

// Get all available interest domains
export const getInterestDomains = () =>
  axiosInstance.get('/api/interests/domains/')

// Save or update user selected interests
// data = { interest_ids: [1, 2, 3] }
export const saveInterests = (data) =>
  axiosInstance.post('/api/interests/save/', data)