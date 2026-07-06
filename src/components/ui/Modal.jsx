import { useEffect } from 'react'
import Divider from './Divider'

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
      className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center p-5"
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

      <div className="material grain relative z-10 w-full max-w-[320px] overflow-hidden rounded-2xl border border-hair p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="font-display text-lg font-semibold text-txt">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl text-txt-sub transition-colors hover:bg-surface-2 hover:text-txt"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <Divider className="mb-4" />

        <div className="font-body text-[13px] leading-relaxed text-txt-sub">{children}</div>
      </div>
    </div>
  )
}
