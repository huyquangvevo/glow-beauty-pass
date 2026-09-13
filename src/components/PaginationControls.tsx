'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
}

function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className = '',
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <nav
      aria-label="Phân trang"
      className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3 ${className}`}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        aria-label="Trang trước"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] border border-[#DDE4D9] bg-white flex items-center justify-center text-[#093E06] hover:bg-[#F5F7F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2px]" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-8 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#5B6B58] font-medium text-[13px] sm:text-[14px] select-none"
            >
              …
            </span>
          )
        }

        const isActive = page === currentPage

        return (
          <button
            key={`page-${page}`}
            type="button"
            onClick={() => !isActive && onPageChange(page)}
            disabled={disabled}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Trang ${page}`}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] text-[13px] sm:text-[14px] flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isActive
                ? 'bg-[#40813D] text-white font-bold shadow-xs cursor-default'
                : 'border border-[#DDE4D9] bg-white text-[#093E06] font-medium hover:bg-[#F5F7F4]'
            }`}
          >
            {page}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        aria-label="Trang kế tiếp"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] border border-[#DDE4D9] bg-white flex items-center justify-center text-[#093E06] hover:bg-[#F5F7F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer active:scale-95"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2px]" />
      </button>
    </nav>
  )
}
