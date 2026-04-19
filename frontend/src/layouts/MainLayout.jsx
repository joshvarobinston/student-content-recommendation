// layouts/MainLayout.jsx
// Main layout wrapper — Navbar + Sidebar + Content area

import Navbar from './Navbar'
import Sidebar from './Sidebar'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ background: '#0f1623' }}>

      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-56 pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>

    </div>
  )
}

export default MainLayout