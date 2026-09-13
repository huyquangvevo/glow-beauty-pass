import { prisma } from '@/lib/prisma'
import snapshotData from '@/lib/spas-snapshot.json'

interface CacheEntry {
  data: {
    spas: any[]
    skus: any[]
  }
  timestamp: number
}

// Global in-memory cache shared across warm lambda invocations
let memoryCache: CacheEntry | null = null
const CACHE_TTL_MS = 3 * 60 * 1000 // 3 minutes

export async function getCachedSpasAndSkus(): Promise<{ spas: any[]; skus: any[] }> {
  const now = Date.now()

  // 1. Return warm memory cache if fresh
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data
  }

  // 2. Fetch fresh data with timeout fallback to snapshot
  try {
    const fetchPromise = Promise.all([
      prisma.spa.findMany({
        where: { isActive: true },
        include: {
          reviews: {
            take: 2,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.serviceSku.findMany(),
    ])

    // Timeout after 1.8 seconds so user never waits 5s
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 1800)
    )

    const [spas, skus] = await Promise.race([fetchPromise, timeoutPromise])

    if (spas && spas.length > 0) {
      memoryCache = {
        data: { spas, skus },
        timestamp: now,
      }
      return memoryCache.data
    }
  } catch (error) {
    console.warn('Database slow or failed, falling back to cache/snapshot:', error)
  }

  // 3. Fallback to existing memory cache or static snapshot
  if (memoryCache) {
    return memoryCache.data
  }

  return {
    spas: snapshotData.spas as any[],
    skus: snapshotData.skus as any[],
  }
}

export async function getCachedSpaBySlug(slug: string): Promise<{ spa: any; skus: any[] } | null> {
  // First check if spa exists in the main cached list
  const { spas, skus } = await getCachedSpasAndSkus()
  const found = spas.find((s) => s.slug === slug)

  if (!found) {
    // If not found in active list, try single lookup
    try {
      const spa = await prisma.spa.findUnique({
        where: { slug },
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })
      if (spa) {
        return { spa, skus }
      }
    } catch {}
    return null
  }

  return { spa: found, skus }
}
