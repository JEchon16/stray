// src/app/admin/(dashboard)/hero/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Film,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import {
  getHeroMedia,
  createHeroMedia,
  updateHeroMedia,
  deleteHeroMedia,
} from '@/lib/hero'
import { uploadHeroMedia } from '@/lib/upload'
import type { HeroMedia } from '@/lib/types'

export default function AdminHeroPage() {
  const [items, setItems] = useState<HeroMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Upload form
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [altText, setAltText] = useState('')

  // ============================================
  // FETCH HERO MEDIA
  // ============================================
  async function loadItems() {
    setLoading(true)
    const { data, error } = await getHeroMedia()

    if (error) {
      setError(error)
    } else {
      setItems(data as HeroMedia[])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  // ============================================
  // HANDLE FILE SELECT
  // ============================================
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate
    const isImage = selectedFile.type.startsWith('image/')
    const isVideo = selectedFile.type.startsWith('video/')

    if (!isImage && !isVideo) {
      setError('File must be image or video')
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setError('')
  }

  // ============================================
  // HANDLE UPLOAD
  // ============================================
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Determine type
      const type = file.type.startsWith('video/') ? 'video' : 'image'

      // Upload to Supabase Storage
      const uploadResult = await uploadHeroMedia(
        file,
        `hero-${type}-${Date.now()}`
      )

      if (uploadResult.error || !uploadResult.url) {
        setError(`Upload failed: ${uploadResult.error}`)
        setUploading(false)
        return
      }

      // Create DB record
      const result = await createHeroMedia({
        type,
        url: uploadResult.url,
        alt_text: altText || null,
        sort_order: items.length,
        active: true,
      })

      if (result.error) {
        setError(result.error)
        setUploading(false)
        return
      }

      // Reset form
      setFile(null)
      setPreview('')
      setAltText('')
      await loadItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }

    setUploading(false)
  }

  // ============================================
  // TOGGLE ACTIVE
  // ============================================
  async function toggleActive(item: HeroMedia) {
    const result = await updateHeroMedia(item.id, { active: !item.active })
    if (result.error) {
      setError(result.error)
      return
    }
    await loadItems()
  }

  // ============================================
  // HANDLE DELETE
  // ============================================
  async function handleDelete(id: string) {
    if (!confirm('Delete this hero media?')) return

    const result = await deleteHeroMedia(id)
    if (result.error) {
      setError(result.error)
      return
    }
    await loadItems()
  }

  // ============================================
  // FORMAT DATE
  // ============================================
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
      {/* HEADER */}
      <div className="mb-12">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
          Manage
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Hero Media
        </h1>
        <p className="text-sm text-neutral-500">
          Manage hero videos and images sa home page
        </p>
      </div>

      {/* ERROR */}
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
        {/* LEFT: UPLOAD FORM */}
        <div className="lg:col-span-1">
          <div className="bg-[#0A0A0A] border border-neutral-900 p-6 sticky top-24">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5">
              Upload Media
            </h2>

            <form onSubmit={handleUpload} className="space-y-5">
              {/* File Upload */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  File (Image o Video)
                </label>
                <div className="relative aspect-video bg-neutral-950 border-2 border-dashed border-neutral-800 hover:border-neutral-600 transition-colors overflow-hidden">
                  {preview ? (
                    <>
                      {file?.type.startsWith('video/') ? (
                        <video
                          src={preview}
                          className="w-full h-full object-contain"
                          controls
                          muted
                        />
                      ) : (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      )}
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
                        Image (5MB) o Video (50MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="Description"
                />
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                disabled={uploading || !file}
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
                    Upload
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: MEDIA LIST */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Media ({items.length})
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
              <Film size={32} className="mx-auto mb-4 text-neutral-700" />
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">
                Wala pang media
              </p>
              <p className="text-xs text-neutral-600">
                Upload your first hero media sa form sa left.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0A0A0A] border border-neutral-900 p-4 flex gap-4 items-center"
                >
                  {/* Preview */}
                  <div className="w-32 h-20 bg-neutral-950 flex-shrink-0 overflow-hidden relative">
                    {item.type === 'video' ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.alt_text || 'Hero'}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                      {item.type === 'video' ? (
                        <Film size={8} />
                      ) : (
                        <ImageIcon size={8} />
                      )}
                      {item.type}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white mb-1 truncate">
                      {item.alt_text || `${item.type.toUpperCase()} #${item.sort_order}`}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
                      Added {formatDate(item.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`p-2 rounded transition-colors ${
                        item.active
                          ? 'text-green-400 hover:bg-green-950/30'
                          : 'text-neutral-500 hover:bg-neutral-900'
                      }`}
                      title={item.active ? 'Active — click to hide' : 'Hidden — click to show'}
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