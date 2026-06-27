import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/65"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-bg-surface bg-bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="modal-title"
            className="font-oswald text-lg font-bold text-gold-primary"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="font-roboto text-[13px] leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </div>
  )
}
