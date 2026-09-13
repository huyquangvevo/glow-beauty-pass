'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import {
  UploadCloud,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  RotateCcw,
  Zap,
} from 'lucide-react'

interface ImageUploaderProps {
  currentImageUrl: string
  onImageChange: (url: string) => void
  stockPhotos: Array<{ url: string; label: string }>
}

/**
 * Nén ảnh tự động ngay trên trình duyệt về định dạng WebP (chuẩn 1200px, quality 85%)
 * Giảm dung lượng từ 5MB - 10MB xuống ~80KB - 120KB
 */
async function compressImageToWebP(file: File, maxWidth = 1200, quality = 0.85): Promise<{ blob: Blob; originalSize: number; compressedSize: number }> {
  const originalSize = file.size
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement('img')
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context không khả dụng'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                originalSize,
                compressedSize: blob.size,
              })
            } else {
              // Fallback nếu browser không hỗ trợ webp canvas toBlob
              canvas.toBlob(
                (fallbackBlob) => {
                  if (fallbackBlob) {
                    resolve({ blob: fallbackBlob, originalSize, compressedSize: fallbackBlob.size })
                  } else {
                    reject(new Error('Không thể nén ảnh'))
                  }
                },
                'image/jpeg',
                quality
              )
            }
          },
          'image/webp',
          quality
        )
      }
      img.onerror = () => reject(new Error('Không thể đọc file ảnh'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Lỗi đọc file'))
    reader.readAsDataURL(file)
  })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ImageUploader({ currentImageUrl, onImageChange, stockPhotos }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [compressionInfo, setCompressionInfo] = useState<{ orig: string; comp: string; saved: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [manualUrl, setManualUrl] = useState(currentImageUrl)
  const [showManualInput, setShowManualInput] = useState(false)

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp định dạng hình ảnh (JPG, PNG, WebP, HEIC).')
      return
    }

    try {
      setErrorMsg('')
      setIsUploading(true)
      setStatusText('Đang tối ưu & nén ảnh WebP...')
      setCompressionInfo(null)

      // 1. Nén ảnh client-side
      const { blob, originalSize, compressedSize } = await compressImageToWebP(file, 1200, 0.85)

      const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      setCompressionInfo({
        orig: formatFileSize(originalSize),
        comp: formatFileSize(compressedSize),
        saved: `${savedPercent}%`,
      })

      // 2. Upload lên Vercel Blob
      setStatusText('Đang lưu lên Vercel Blob Storage...')
      const safeName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
      const targetFilename = `${safeName}-${Date.now()}.webp`

      const formData = new FormData()
      formData.append('file', blob, targetFilename)

      const res = await fetch(`/api/upload?filename=${targetFilename}`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload lên máy chủ thất bại.')
      }

      // 3. Cập nhật URL ảnh mới
      onImageChange(data.url)
      setManualUrl(data.url)
      setStatusText('Tải lên thành công!')
    } catch (err: any) {
      console.error('Upload error:', err)
      setErrorMsg(err?.message || 'Không thể tải ảnh lên. Vui lòng kiểm tra lại kết nối.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      {/* Ẩn input file gốc */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* KHUNG KÉO THẢ & PREVIEW UPLOAD CHÍNH */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative rounded-3xl p-5 sm:p-6 border-2 border-dashed transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-5 ${
          isDragging
            ? 'border-[#40813D] bg-emerald-50/60 shadow-md scale-101'
            : 'border-stone-300 hover:border-[#40813D] bg-stone-50/70 hover:bg-emerald-50/20'
        } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        {/* Preview ảnh hiện tại */}
        <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden bg-stone-200 border border-stone-300/80 shrink-0 shadow-inner group">
          {currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt="Ảnh đại diện Spa"
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-1">
              <ImageIcon className="w-8 h-8" />
              <span className="text-[11px]">Chưa có ảnh</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 p-2 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-[11px] font-bold">{statusText}</span>
            </div>
          )}
        </div>

        {/* Nội dung hướng dẫn & nút bấm */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#236B38] text-[11px] font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Vercel Blob Storage • Tự Động Nén WebP</span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-stone-900">
            Tải Ảnh Spa Từ Máy Tính / Điện Thoại
          </h3>
          <p className="text-xs text-stone-500 max-w-md">
            Kéo thả ảnh vào đây hoặc bấm để chọn tệp. Hệ thống tự động nén dung lượng xuống chuẩn WebP siêu nhẹ giúp tải nhanh và tiết kiệm bộ nhớ.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#40813D] hover:bg-[#356F32] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Đang Tải Lên...' : 'Chọn Ảnh Từ Thiết Bị'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowManualInput(!showManualInput)
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 text-xs font-semibold transition-colors"
            >
              {showManualInput ? 'Ẩn ô nhập URL' : 'Dán link URL'}
            </button>
          </div>

          {/* Thông tin nén sau khi upload */}
          {compressionInfo && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium animate-in fade-in duration-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Đã tối ưu: {compressionInfo.orig} → <strong>{compressionInfo.comp}</strong> (Tiết kiệm {compressionInfo.saved})
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ô NHẬP URL THỦ CÔNG (Tùy chọn) */}
      {showManualInput && (
        <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <label className="text-xs font-bold text-stone-700 block">
            Dán đường dẫn ảnh trực tiếp (URL ngoài):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#40813D]"
            />
            <button
              type="button"
              onClick={() => {
                onImageChange(manualUrl)
                setCompressionInfo(null)
              }}
              className="px-4 py-2 bg-[#40813D] hover:bg-[#356F32] text-white text-xs font-bold rounded-xl transition-all"
            >
              Áp Dụng
            </button>
          </div>
        </div>
      )}

      {/* HOẶC CHỌN NHANH 5 ẢNH STOCK CÓ SẴN */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-bold text-stone-600 block">
          Hoặc Chọn Nhanh Ảnh Mẫu Chuẩn Hóa Của Glow:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stockPhotos.map((photo) => (
            <button
              type="button"
              key={photo.url}
              onClick={() => {
                onImageChange(photo.url)
                setManualUrl(photo.url)
                setCompressionInfo(null)
              }}
              className={`relative rounded-2xl overflow-hidden aspect-4/3 border-2 transition-all group cursor-pointer ${
                currentImageUrl === photo.url
                  ? 'border-[#40813D] ring-2 ring-[#40813D]/20 shadow-md scale-102'
                  : 'border-transparent opacity-75 hover:opacity-100 hover:border-stone-300'
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.label}
                fill
                sizes="(max-width: 640px) 50vw, 140px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-[10px] text-white font-medium truncate">{photo.label}</span>
              </div>
              {currentImageUrl === photo.url && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#40813D] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
