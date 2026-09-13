import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Unauthorized: Bạn cần đăng nhập để tải ảnh.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    let filename = searchParams.get('filename') || `spa-${Date.now()}.webp`
    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')

    const contentType = request.headers.get('content-type') || ''
    let fileBuffer: Buffer | ReadableStream | Blob

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return NextResponse.json({ error: 'Không tìm thấy tệp đính kèm trong form.' }, { status: 400 })
      }
      filename = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : filename
      fileBuffer = file
    } else {
      if (!request.body) {
        return NextResponse.json({ error: 'Nội dung tải lên rỗng.' }, { status: 400 })
      }
      fileBuffer = request.body
    }

    // Check if Vercel Blob token exists
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN is not set. Local fallback triggered.')
      return NextResponse.json(
        {
          error: 'Chưa cấu hình BLOB_READ_WRITE_TOKEN trên môi trường.',
        },
        { status: 500 }
      )
    }

    // Upload to Vercel Blob Storage
    const blob = await put(`spas/${filename}`, fileBuffer, {
      access: 'public',
      addRandomSuffix: true, // Prevents overwriting existing files
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
    })
  } catch (error: any) {
    console.error('Upload to Vercel Blob error:', error)
    return NextResponse.json(
      { error: error?.message || 'Đã xảy ra lỗi khi tải ảnh lên Vercel Blob.' },
      { status: 500 }
    )
  }
}
