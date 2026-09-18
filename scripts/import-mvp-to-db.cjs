const { PrismaClient } = require('@prisma/client')
const { MVP_SPAS, MVP_SERVICES } = require('./dist/mvp-data.js')

const prisma = new PrismaClient()

async function main() {
  console.log('--- START IMPORTING MVP DATA TO SUPABASE POSTGRESQL ---')
  console.log(`Found ${MVP_SERVICES.length} MVP Services to import.`)
  console.log(`Found ${MVP_SPAS.length} MVP Spas to import.`)

  // 1. Import Service SKUs
  console.log('\n[1/2] Upserting Service SKUs...')
  for (const s of MVP_SERVICES) {
    const skuData = {
      code: s.id,
      name: s.name,
      shortName: s.short,
      price: s.price,
      pricePhase1: s.price,
      pricePhase2: s.price,
      spaCost: s.price,
      dur: s.dur || '',
      durationMinutes: s.dur && s.dur.includes('60') ? 60 : 45,
      badge: s.badge || null,
      wide: !!s.wide,
      spaCount: s.count || 0,
      description: s.desc || s.name,
    }

    await prisma.serviceSku.upsert({
      where: { code: s.id },
      update: skuData,
      create: skuData,
    })
    console.log(`  ✓ Service: ${s.name} (${s.id}) - ${s.price}đ`)
  }

  // 2. Import Spas
  console.log('\n[2/2] Upserting Spas...')
  let importedCount = 0

  for (let i = 0; i < MVP_SPAS.length; i++) {
    const spa = MVP_SPAS[i]
    const slug = spa.id

    const phone =
      spa.phone || `091${String(1000000 + i).slice(1)}`

    const tier =
      spa.tier?.toUpperCase() === 'CERTIFIED'
        ? 'CERTIFIED'
        : spa.tier?.toUpperCase() === 'VERIFIED'
        ? 'VERIFIED'
        : 'STANDARD'

    const spaPayload = {
      name: spa.name,
      slug: slug,
      address: spa.address,
      district: spa.district || spa.ward || 'Trung tâm',
      ward: spa.ward || 'Phường trung tâm',
      city: spa.city || 'hn',
      cityName: spa.cityName || (spa.city === 'hcm' ? 'TP.HCM' : spa.city === 'dn' ? 'Đà Nẵng' : 'Hà Nội'),
      phone: phone,
      latitude: spa.lat,
      longitude: spa.lng,
      openHours: '09:00 - 21:30',
      todayHours: spa.today || 'Hôm nay 09:00 - 21:30',
      hours: spa.hours || [
        { d: 'T2 - T6', t: '09:00 - 21:30' },
        { d: 'T7 - CN', t: '09:00 - 21:30' },
      ],
      photos: spa.photos || ['/spas/spa_thumb_1.jpg'],
      serviceIds: spa.serviceIds || ['goi-sach', 'duong-sinh'],
      rating: spa.rating || 4.9,
      reviewCount: spa.reviews || 150,
      tier: tier,
      imageUrl: (spa.photos && spa.photos[0]) || null,
      isActive: true,
    }

    await prisma.spa.upsert({
      where: { slug: slug },
      update: spaPayload,
      create: spaPayload,
    })
    importedCount++
    console.log(`  ✓ Spa [${importedCount}/${MVP_SPAS.length}]: ${spa.name} (${spa.cityName})`)
  }

  console.log('\n--- VERIFICATION AFTER IMPORT ---')
  const totalSpas = await prisma.spa.count()
  const totalSkus = await prisma.serviceSku.count()
  console.log(`Total Spas in Supabase DB: ${totalSpas}`)
  console.log(`Total ServiceSkus in Supabase DB: ${totalSkus}`)

  // Phân bổ theo thành phố
  const hnSpas = await prisma.spa.count({ where: { city: 'hn' } })
  const hcmSpas = await prisma.spa.count({ where: { city: 'hcm' } })
  const dnSpas = await prisma.spa.count({ where: { city: 'dn' } })
  console.log(`  - Hà Nội (hn): ${hnSpas} spas`)
  console.log(`  - TP.HCM (hcm): ${hcmSpas} spas`)
  console.log(`  - Đà Nẵng (dn): ${dnSpas} spas`)

  console.log('--- COMPLETED SUCCESSFULLY ---')
}

main()
  .catch((e) => {
    console.error('Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
