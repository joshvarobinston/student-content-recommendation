// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import InterestSelectionPage from './pages/InterestSelectionPage'
import FeedPage from './pages/FeedPage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import UpdateInterestsPage from './pages/UpdateInterestsPage'
import DeleteAccountPage from './pages/DeleteAccountPage'
import SettingsPage from './pages/SettingsPage'
import LibraryPage from './pages/LibraryPage'
import FolderDetailPage from './pages/FolderDetailPage'
import SavedItemsPage from './pages/SavedItemsPage'
import LikedItemsPage from './pages/LikedItemsPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />

        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Onboarding */}
          <Route path="/interests" element={
            <ProtectedRoute><InterestSelectionPage /></ProtectedRoute>
          } />

          {/* Main Pages */}
          <Route path="/feed" element={
            <ProtectedRoute><FeedPage /></ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute><SearchResultsPage /></ProtectedRoute>
          } />

          {/* Profile Pages */}
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/profile/edit" element={
            <ProtectedRoute><EditProfilePage /></ProtectedRoute>
          } />
          <Route path="/profile/change-password" element={
            <ProtectedRoute><ChangePasswordPage /></ProtectedRoute>
          } />
          <Route path="/profile/delete-account" element={
            <ProtectedRoute><DeleteAccountPage /></ProtectedRoute>
          } />
          <Route path="/update-interests" element={
            <ProtectedRoute><UpdateInterestsPage /></ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="/settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />

          {/* Library Pages */}
          <Route path="/library" element={
            <ProtectedRoute><LibraryPage /></ProtectedRoute>
          } />
          <Route path="/library/:id" element={
            <ProtectedRoute><FolderDetailPage /></ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute><SavedItemsPage /></ProtectedRoute>
          } />
          <Route path="/liked" element={
            <ProtectedRoute><LikedItemsPage /></ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App