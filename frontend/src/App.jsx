import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'

import ChangePasswordPage from './pages/ChangePasswordPage'
import DeleteAccountPage from './pages/DeleteAccountPage'
import EditProfilePage from './pages/EditProfilePage'
import FeedPage from './pages/FeedPage'
import FolderDetailPage from './pages/FolderDetailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import InterestSelectionPage from './pages/InterestSelectionPage'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import LikedItemsPage from './pages/LikedItemsPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SavedItemsPage from './pages/SavedItemsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import UpdateInterestsPage from './pages/UpdateInterestsPage'
import VerifyOtpPage from './pages/VerifyOtpPage'

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/interests" element={<ProtectedRoute><InterestSelectionPage /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/profile/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
          <Route path="/profile/delete-account" element={<ProtectedRoute><DeleteAccountPage /></ProtectedRoute>} />
          <Route path="/update-interests" element={<ProtectedRoute><UpdateInterestsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
          <Route path="/library/:id" element={<ProtectedRoute><FolderDetailPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedItemsPage /></ProtectedRoute>} />
          <Route path="/liked" element={<ProtectedRoute><LikedItemsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
