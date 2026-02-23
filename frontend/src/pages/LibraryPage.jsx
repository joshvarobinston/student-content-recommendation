// pages/LibraryPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getFolders, createFolder, deleteFolder } from '../api/libraryApi'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import Modal from '../components/common/Modal'

const LibraryPage = () => {
  const navigate = useNavigate()

  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderDesc, setNewFolderDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      const res = await getFolders()
      setFolders(res.data)
    } catch (error) {
      toast.error('Failed to load folders')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required')
      return
    }

    setCreating(true)
    try {
      const res = await createFolder({
        name: newFolderName.trim(),
        description: newFolderDesc.trim(),
      })
      setFolders([...folders, res.data])
      setModalOpen(false)
      setNewFolderName('')
      setNewFolderDesc('')
      toast.success('Folder created!')
    } catch (error) {
      toast.error('Failed to create folder')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (folderId) => {
    if (!window.confirm('Delete this folder and all its items?')) return

    setDeletingId(folderId)
    try {
      await deleteFolder(folderId)
      setFolders(folders.filter((f) => f.id !== folderId))
      toast.success('Folder deleted!')
    } catch (error) {
      toast.error('Failed to delete folder')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-slate-800">My Library</h1>
            <p className="text-slate-400 text-sm mt-1">Organize your saved content into folders</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            + New Folder
          </button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/saved-items')}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:border-indigo-200 hover:shadow-sm transition-all text-left"
          >
            <span className="text-2xl">🔖</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Saved Items</p>
              <p className="text-slate-400 text-xs">All your bookmarked content</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/liked-items')}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:border-indigo-200 hover:shadow-sm transition-all text-left"
          >
            <span className="text-2xl">❤️</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Liked Items</p>
              <p className="text-slate-400 text-xs">All your liked content</p>
            </div>
          </button>
        </div>

        {/* Folders */}
        <h2 className="font-heading font-semibold text-lg text-slate-700 mb-4">Study Folders</h2>

        {loading ? (
          <Loader />
        ) : folders.length === 0 ? (
          <EmptyState
            icon="📁"
            title="No folders yet"
            message="Create your first study folder to organize your content."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-indigo-100 transition-all"
              >
                {/* Folder Icon + Name */}
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/library/${folder.id}`)}
                >
                  <div className="text-3xl mb-3">📁</div>
                  <h3 className="font-heading font-semibold text-slate-800 mb-1 line-clamp-1">
                    {folder.name}
                  </h3>
                  {folder.description && (
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3">
                      {folder.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    {new Date(folder.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Delete Button */}
                <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleDelete(folder.id)}
                    disabled={deletingId === folder.id}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
                  >
                    {deletingId === folder.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Folder"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">Folder Name</label>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Machine Learning Notes"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">
              Description <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={newFolderDesc}
              onChange={(e) => setNewFolderDesc(e.target.value)}
              placeholder="What is this folder about?"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              {creating ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </div>
      </Modal>

    </MainLayout>
  )
}

export default LibraryPage