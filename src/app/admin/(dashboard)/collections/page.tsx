// src/app/admin/(dashboard)/collections/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Folder,
} from 'lucide-react'
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from '@/lib/collections'
import { uploadCollectionImage } from '@/lib/upload'
import type { Collection } from '@/lib/types'

const STATUS_OPTIONS = ['Available', 'Coming Soon', 'Sold Out', 'Limited']

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('Available')
  const [link, setLink] = useState('/shop')

  async function loadItems() {
    setLoading(true)
    const { data, error } = await getCollections()

    if (error) {
      setError(error)
    } else {
      setItems(data as Collection[])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setError('Image file lang pwede')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Max 5MB per image')
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setError('')
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!file || !name.trim()) {
      setError('Please fill in all required fields')
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploadResult = await uploadCollectionImage(
        file,
        `collection-${Date.now()}`
      )

      if (uploadResult.error || !uploadResult.url) {
        setError(`Upload failed: ${uploadResult.error}`)
        setUploading(false)
        return
      }

      const result = await createCollection({
        name: name.trim(),
        status,
        image_url: uploadResult.url,
        link: link || '/shop',
        sort_order: items.length,
        active: true,
      })

      if (result.error) {
        setError(result.error)
        setUploading(false)
        return
      }

      setFile(null)
      setPreview('')
      setName('')
      setStatus('Available')
      setLink('/shop')
      await loadItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }

    setUploading(false)
  }

  async function toggleActive(item: Collection) {
    const result = await updateCollection(item.id, { active: !item.active })
    if (result.error) {
      setError(result.error)
      return
    }
    await loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this collection?')) return

    const result = await deleteCollection(id)
    if (result.error) {
      setError(result.error)
      return
    }
    await loadItems()
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <div className="mb-12">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
          Manage
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Collections
        </h1>
        <p className="text-sm text-neutral-500">
          Manage collections sa home page
        </p>
      </div>

      {error && (
        <div className="mb-6 px-5 py-4 bg-red-950/30 border border-red-900/50 text-red-400 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="p-1 hover:bg-red-950/50 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-[#0A0A0A] border border-neutral-900 p-6 sticky top-24">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5">
              Add Collection
            </h2>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Collection Image *
                </label>
                <div className="relative aspect-[3/4] bg-neutral-950 border-2 border-dashed border-neutral-800 hover:border-neutral-600 transition-colors overflow-hidden">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null)
                          setPreview('')
                        }}
                        className="absolute top-2 right-2 p-2 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Upload size={24} className="text-neutral-600 mb-3" />
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1">
                        Click to upload
                      </p>
                      <p className="text-[10px] text-neutral-600">
                        Max 5MB (JPG/PNG)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="2026 Collection"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white transition-colors"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Link (optional)
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="/shop"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file || !name.trim()}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add Collection
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Collections ({items.length})
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-[#0A0A0A] border border-neutral-900 animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-[#0A0A0A] border border-neutral-900 p-12 text-center">
              <Folder size={32} className="mx-auto mb-4 text-neutral-700" />
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">
                Wala pang collections
              </p>
              <p className="text-xs text-neutral-600">
                Add your first collection sa form sa left.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0A0A0A] border border-neutral-900 p-4 flex gap-4 items-center"
                >
                  <div className="w-20 h-28 bg-neutral-950 flex-shrink-0 overflow-hidden relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-white text-[8px] font-bold uppercase tracking-wider">
                      {item.status}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-1 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] mb-1">
                      Order: {item.sort_order}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
                      Added {formatDate(item.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`p-2 rounded transition-colors ${
                        item.active
                          ? 'text-green-400 hover:bg-green-950/30'
                          : 'text-neutral-500 hover:bg-neutral-900'
                      }`}
                      title={item.active ? 'Active' : 'Hidden'}
                    >
                      {item.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}