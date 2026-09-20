// src/components/size-chart-modal.tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface SizeChartModalProps {
  isOpen: boolean
  onClose: () => void
  chartImage?: string
}

export default function SizeChartModal({
  isOpen,
  onClose,
  chartImage = '/images/chart.jpg',
}: SizeChartModalProps) {
  const [imageError, setImageError] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black">
              Size Chart
            </h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] mt-1">
              Guide sa pagpili ng size
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chart Image */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
          {imageError ? (
            <div className="text-center py-20">
              <p className="text-sm text-neutral-500 uppercase tracking-[0.15em] mb-2">
                Size Chart not available
              </p>
              <p className="text-xs text-neutral-400">
                Please contact us for sizing information
              </p>
            </div>
          ) : (
            <img
              src={chartImage}
              alt="Size Chart"
              className="w-full h-auto"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-white">
          <p className="text-[10px] text-neutral-500 text-center uppercase tracking-[0.15em]">
            All measurements in centimeters (cm)
          </p>
        </div>
      </div>
    </div>
  )
}