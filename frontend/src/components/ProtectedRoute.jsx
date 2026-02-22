// components/ProtectedRoute.jsx
// Protects pages that require authentication
// Redirects to /login if user is not logged in

import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/token'

const ProtectedRoute = ({ children }) => {
  // If no token found redirect to login
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  // User is logged in — render the page
  return children
}

export default ProtectedRoute