// src/components/auth-prompt-modal.tsx
'use client'

import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  redirectTo = '/checkout',
}: AuthPromptModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-8 sm:p-10 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
            Account Required
          </p>
          <h2 className="text-2xl font-black tracking-tight mb-3">
            May account ka na ba?
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            Para maka-checkout, kailangan mo munang mag-sign in o gumawa ng
            account.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href={`/login?redirect=${redirectTo}`}
              className="group w-full inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
            >
              Sign In
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href={`/signup?redirect=${redirectTo}`}
              className="w-full inline-flex items-center justify-center gap-3 border border-neutral-200 text-black px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-black transition-all"
            >
              Create Account
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-[10px] text-neutral-400 mt-6 leading-relaxed">
            Kung may account ka na, i-sign in mo lang para ma-proceed yung order
            mo.
          </p>
        </div>
      </div>
    </div>
  )
}