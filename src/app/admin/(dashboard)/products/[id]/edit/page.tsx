// src/app/admin/(dashboard)/products/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateProduct, deleteProduct, getProduct } from '@/lib/products'
import { uploadProductImage } from '@/lib/upload'

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Tees')
  const [badge, setBadge] = useState('')
  const [soldOut, setSoldOut] = useState(false)

  // Image state — existing URLs
  const [existingFrontUrl, setExistingFrontUrl] = useState('')
  const [existingBackUrl, setExistingBackUrl] = useState('')

  // Image state — new uploads
  const [imageFront, setImageFront] = useState<File | null>(null)
  const [imageBack, setImageBack] = useState<File | null>(null)
  const [imageFrontPreview, setImageFrontPreview] = useState('')
  const [imageBackPreview, setImageBackPreview] = useState('')

  // Load product data
  useEffect(() => {
    async function loadProduct() {
      setInitialLoading(true)
      const { product, error } = await getProduct(id)

      if (error || !product) {
        setError('Product not found')
        setInitialLoading(false)
        return
      }

      setName(product.name)
      setSlug(product.slug || '')
      setDescription(product.description || '')
      setPrice(String(product.price))
      setCategory(product.category)
      setBadge(product.badge || '')
      setSoldOut(product.sold_out)
      setExistingFrontUrl(product.image_front)
      setExistingBackUrl(product.image_back || '')
      setImageFrontPreview(product.image_front)
      if (product.image_back) {
        setImageBackPreview(product.image_back)
      }
      setInitialLoading(false)
    }

    if (id) loadProduct()
  }, [id])

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleNameChange(value: string) {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

  function handleImageFrontChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFront(file)
      setImageFrontPreview(URL.createObjectURL(file))
    }
  }

  function handleImageBackChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageBack(file)
      setImageBackPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Upload new front image (if changed)
      let frontUrl = existingFrontUrl
      if (imageFront) {
        const frontUpload = await uploadProductImage(imageFront, `${slug}-front`)
        if (frontUpload.error || !frontUpload.url) {
          setError(`Front image upload failed: ${frontUpload.error}`)
          setLoading(false)
          return
        }
        frontUrl = frontUpload.url
      }

      // Upload new back image (if changed)
      let backUrl = existingBackUrl || null
      if (imageBack) {
        const backUpload = await uploadProductImage(imageBack, `${slug}-back`)
        if (backUpload.error || !backUpload.url) {
          setError(`Back image upload failed: ${backUpload.error}`)
          setLoading(false)
          return
        }
        backUrl = backUpload.url
      }

      // Update product
      const result = await updateProduct(id, {
        name,
        slug,
        description,
        price: parseFloat(price),
        image_front: frontUrl,
        image_back: backUrl,
        badge: badge || null,
        category,
        sold_out: soldOut,
      })

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteProduct(id)

    if (result.error) {
      setError(result.error)
      setDeleting(false)
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  // Loading state
  if (initialLoading) {
    return (
      <div className="p-10 max-w-5xl">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-neutral-900 w-32" />
          <div className="h-12 bg-neutral-900 w-64" />
          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-square bg-neutral-900" />
            <div className="aspect-square bg-neutral-900" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 max-w-5xl">
      {/* HEADER */}
      <div className="mb-12">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] hover:text-white transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Products
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Edit
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              {name || 'Product'}
            </h1>
            <p className="text-sm text-neutral-500">Update product information</p>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 border border-red-900/50 hover:bg-red-950/30 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* IMAGES */}
        <section>
          <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-5">
            Images
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Image */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                Front Image <span className="text-red-500">*</span>
              </label>
              <div className="aspect-square bg-neutral-950 border border-neutral-900 overflow-hidden relative group cursor-pointer">
                {imageFrontPreview && (
                  <img
                    src={imageFrontPreview}
                    alt="Front preview"
                    className="w-full h-full object-contain p-4"
                  />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Change
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFrontChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Back Image */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                Back Image <span className="text-neutral-600">(optional)</span>
              </label>
              <div className="aspect-square bg-neutral-950 border border-neutral-900 overflow-hidden relative group cursor-pointer">
                {imageBackPreview ? (
                  <img
                    src={imageBackPreview}
                    alt="Back preview"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-700 mb-3">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <p className="text-xs text-neutral-600">Click to upload</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageBackChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BASIC INFO */}
        <section>
          <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-5">
            Basic Information
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm font-mono focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Price (₱) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Tees">Tees</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Pants">Pants</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm focus:outline-none focus:border-white transition-colors"
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Sale">Sale</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  Sold Out
                </label>
                <button
                  type="button"
                  onClick={() => setSoldOut(!soldOut)}
                  className={`w-full px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all border ${
                    soldOut
                      ? 'bg-red-950/30 border-red-900/50 text-red-400'
                      : 'bg-neutral-950 border-neutral-900 text-neutral-500 hover:border-neutral-700'
                  }`}
                >
                  {soldOut ? 'Sold Out' : 'Available'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="px-5 py-4 bg-red-950/30 border border-red-900/50 text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-900">
          <Link
            href="/admin/products"
            className="px-7 py-4 border border-neutral-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md bg-[#0A0A0A] border border-neutral-900 p-8">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-950/30 border border-red-900/50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-center mb-3">Delete Product?</h3>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Are you sure you want to delete <strong className="text-white">{name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 border border-neutral-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-red-500 transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}