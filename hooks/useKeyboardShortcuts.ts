'use client'

import { useEffect } from 'react'

interface ShortcutHandlers {
  onCloseModals: () => void
  onCheckout: () => void
}

export function useKeyboardShortcuts({ onCloseModals, onCheckout }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search input on '/'
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        const searchInput = document.getElementById('pos-search-input')
        searchInput?.focus()
        return
      }

      // Close modal on 'Escape'
      if (e.key === 'Escape') {
        onCloseModals()
        return
      }

      // Quick checkout on 'Ctrl + Enter' or 'Cmd + Enter'
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        onCheckout()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCloseModals, onCheckout])
}
