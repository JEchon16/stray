// src/lib/upload.ts
'use server'

import { supabaseAdmin } from './supabase-server'

// ============================================
// UPLOAD PRODUCT IMAGE (public bucket)
// ============================================
export async function uploadProductImage(
  file: File,
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
  return uploadToBucket(file, fileName, 'product-images')
}

// ============================================
// UPLOAD GCASH PROOF (private bucket)
// ============================================
export async function uploadGcashProof(
  file: File,
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
  return uploadToBucket(file, fileName, 'gcash-proofs')
}

// ============================================
// GENERIC UPLOAD HELPER
// ============================================
async function uploadToBucket(
  file: File,
  fileName: string,
  bucket: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'File must be an image' }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'File size must be less than 5MB' }
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const uniqueName = `${fileName}-${timestamp}-${random}.${ext}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL (works kahit private bucket, pero naka-signed URL sa view)
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
// ============================================
// UPLOAD HERO MEDIA (image o video)
// ============================================
export async function uploadHeroMedia(
  file: File,
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validate file type — image OR video
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return { url: null, error: 'File must be an image or video' }
    }

    // Validate file size
    // Image: max 5MB
    // Video: max 50MB
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        url: null,
        error: `File size must be less than ${isVideo ? '50MB' : '5MB'}`,
      }
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const uniqueName = `${fileName}-${timestamp}-${random}.${ext}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('hero-media')
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('hero-media')
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// UPLOAD COLLECTION IMAGE
// ============================================
export async function uploadCollectionImage(
  file: File,
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
  return uploadToBucket(file, fileName, 'collections')
}

// ============================================
// UPLOAD LOOKBOOK IMAGE
// ============================================
export async function uploadLookbookImage(
  file: File,
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
  return uploadToBucket(file, fileName, 'lookbook')
}