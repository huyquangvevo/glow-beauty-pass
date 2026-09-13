import React from 'react'
import Image from 'next/image'

export function ZaloIcon({ className = 'w-6 h-6', size = 28 }: { className?: string; size?: number }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-md ${className}`}>
      <Image
        src="/brand/zalo-logo.webp"
        alt="Zalo"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-xs"
        priority
      />
    </div>
  )
}
