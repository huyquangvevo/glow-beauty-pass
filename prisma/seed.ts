import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding GlowBeautyPass data...')

  // 1. Seed Service SKUs
  const skus = [
    {
      code: 'GOI_SACH',
      name: 'Gội sạch thư giãn',
      durationMinutes: 45,
      pricePhase1: 49000,
      pricePhase2: 59000,
      spaCost: 49000,
      description: 'Quy trình chuẩn 6 bước: Tẩy trang mặt nhẹ, 2 lần gội thảo dược, xả dưỡng mượt, sấy khô tạo kiểu cơ bản.',
      standardProducts: 'Dầu gội bồ kết cô đặc hữu cơ, xả dưỡng vỏ bưởi tự nhiên',
    },
    {
      code: 'GOI_PREMIUM',
      name: 'Gội Premium phục hồi',
      durationMinutes: 55,
      pricePhase1: 69000,
      pricePhase2: 85000,
      spaCost: 69000,
      description: 'Sử dụng cặp dầu gội/xả cao cấp trong danh mục kiểm định, ủ dưỡng phục hồi nhiệt, massage cổ vai gáy 10 phút.',
      standardProducts: 'Moroccanoil Hydrating / Kérastase Nutritive / Olaplex No.4 & No.5',
    },
    {
      code: 'GOI_DUONG_SINH',
      name: 'Gội đầu dưỡng sinh Trung Hoa',
      durationMinutes: 65,
      pricePhase1: 149000,
      pricePhase2: 179000,
      spaCost: 149000,
      description: 'Khai thông huyệt đạo vùng đầu, xông canh thảo dược ấm, bài massage trị liệu chuyên sâu cổ - vai - gáy giảm đau mỏi công sở.',
      standardProducts: 'Nước canh thảo dược bài thuốc Dao Đỏ, tinh dầu gừng ấm',
    },
  ]

  for (const s of skus) {
    await prisma.serviceSku.upsert({
      where: { code: s.code },
      update: s,
      create: s,
    })
  }

  // 2. Seed 15 Spa tại Quận Cầu Giấy (Khu vực Pilot)
  const spas = [
    {
      name: 'An Nhiên Dưỡng Sinh Spa',
      slug: 'an-nhien-duong-sinh-cau-giay',
      address: 'Số 18 Ngõ 165 Cầu Giấy, P. Dịch Vọng, Cầu Giấy, Hà Nội',
      ward: 'Dịch Vọng',
      phone: '0912345001',
      latitude: 21.0336,
      longitude: 105.7942,
      openHours: '09:00 - 21:30',
      rating: 4.9,
      reviewCount: 42,
      tier: 'CERTIFIED',
      exclusiveOffer: 'Tặng 10 phút massage bấm huyệt đả thông kinh lạc',
    },
    {
      name: 'Mộc Trà Beauty & Hair Spa',
      slug: 'moc-tra-beauty-trung-hoa',
      address: 'Số 42 Ngõ 29 Nguyễn Thị Định, P. Trung Hòa, Cầu Giấy, Hà Nội',
      ward: 'Trung Hòa',
      phone: '0912345002',
      latitude: 21.0089,
      longitude: 105.8031,
      openHours: '08:30 - 21:00',
      rating: 4.8,
      reviewCount: 38,
      tier: 'VERIFIED',
      exclusiveOffer: 'Tặng 1 mặt nạ dừa tươi cấp ẩm',
    },
    {
      name: 'Bạch Cúc Hair & Head Spa',
      slug: 'bach-cuc-hair-spa-duy-tan',
      address: 'Tầng 1 Tòa Nhà B3, Ngõ 78 Duy Tân, P. Dịch Vọng Hậu, Cầu Giấy',
      ward: 'Dịch Vọng Hậu',
      phone: '0912345003',
      latitude: 21.0298,
      longitude: 105.7834,
      openHours: '09:00 - 20:30',
      rating: 4.7,
      reviewCount: 29,
      tier: 'STANDARD',
      exclusiveOffer: 'Giảm thêm 10% khi đi theo nhóm 2 người khung 13h-16h',
    },
    {
      name: 'Lá Quê Dưỡng Sinh Quán',
      slug: 'la-que-duong-sinh-quan-hoa-bang',
      address: 'Số 85 Hoa Bằng, P. Yên Hòa, Cầu Giấy, Hà Nội',
      ward: 'Yên Hòa',
      phone: '0912345004',
      latitude: 21.0215,
      longitude: 105.7954,
      openHours: '09:00 - 21:00',
      rating: 4.8,
      reviewCount: 35,
      tier: 'VERIFIED',
      exclusiveOffer: 'Tặng khăn ủ ấm tinh dầu thảo dược',
    },
    {
      name: 'Sen Vàng Beauty Care',
      slug: 'sen-vang-beauty-care-tran-thai-tong',
      address: 'Số 36 Ngõ 45 Trần Thái Tông, P. Dịch Vọng, Cầu Giấy',
      ward: 'Dịch Vọng',
      phone: '0912345005',
      latitude: 21.0345,
      longitude: 105.7876,
      openHours: '09:00 - 21:00',
      rating: 4.9,
      reviewCount: 51,
      tier: 'CERTIFIED',
      exclusiveOffer: 'Miễn phí ngâm chân nước gừng quế ấm trước khi gội',
    },
    {
      name: 'Hương Thảo Dược Clinic & Spa',
      slug: 'huong-thao-duoc-to-hieu',
      address: 'Số 112 Tô Hiệu, P. Nghĩa Tân, Cầu Giấy, Hà Nội',
      ward: 'Nghĩa Tân',
      phone: '0912345006',
      latitude: 21.0423,
      longitude: 105.7928,
      openHours: '08:30 - 21:00',
      rating: 4.7,
      reviewCount: 24,
      tier: 'STANDARD',
      exclusiveOffer: 'Tặng sấy tạo kiểu tóc duỗi/xoăn bồng bềnh',
    },
    {
      name: 'Ngọc Lan Thảo Mộc Hair & Spa',
      slug: 'ngoc-lan-thao-moc-hoang-quoc-viet',
      address: 'Số 23 Ngõ 106 Hoàng Quốc Việt, P. Nghĩa Đô, Cầu Giấy',
      ward: 'Nghĩa Đô',
      phone: '0912345007',
      latitude: 21.0467,
      longitude: 105.7981,
      openHours: '09:00 - 21:00',
      rating: 4.8,
      reviewCount: 31,
      tier: 'VERIFIED',
      exclusiveOffer: 'Tặng 1 ly trà thảo mộc dưỡng nhan hạt chia',
    },
    {
      name: 'Tâm An Dưỡng Tâm Spa',
      slug: 'tam-an-duong-tam-xuan-thuy',
      address: 'Số 19 Ngõ 130 Xuân Thủy, P. Dịch Vọng Hậu, Cầu Giấy',
      ward: 'Dịch Vọng Hậu',
      phone: '0912345008',
      latitude: 21.0368,
      longitude: 105.7825,
      openHours: '09:00 - 21:00',
      rating: 4.9,
      reviewCount: 46,
      tier: 'CERTIFIED',
      exclusiveOffer: 'Tặng bài ngải cứu xông ấm vùng vai gáy',
    },
    {
      name: 'Thư Giãn Phố Hair Lounge',
      slug: 'thu-gian-pho-nguyen-khang',
      address: 'Số 250 Nguyễn Khang, P. Yên Hòa, Cầu Giấy',
      ward: 'Yên Hòa',
      phone: '0912345009',
      latitude: 21.0182,
      longitude: 105.8012,
      openHours: '09:00 - 21:30',
      rating: 4.6,
      reviewCount: 19,
      tier: 'STANDARD',
      exclusiveOffer: 'Tặng massage tay bấm huyệt giải mỏi bàn phím',
    },
    {
      name: 'Yên Nhiên Thảo Viện',
      slug: 'yen-nhien-thao-vien-chua-ha',
      address: 'Số 5 Ngõ 20 Chùa Hà, P. Dịch Vọng, Cầu Giấy',
      ward: 'Dịch Vọng',
      phone: '0912345010',
      latitude: 21.0371,
      longitude: 105.7967,
      openHours: '08:30 - 21:00',
      rating: 4.8,
      reviewCount: 33,
      tier: 'VERIFIED',
      exclusiveOffer: 'Tặng ủ tóc phục hồi collagen thảo dược',
    },
    {
      name: 'Glow Care Dưỡng Sinh Trần Đăng Ninh',
      slug: 'glow-care-tran-dang-ninh',
      address: 'Số 68 Trần Đăng Ninh, P. Dịch Vọng, Cầu Giấy',
      ward: 'Dịch Vọng',
      phone: '0912345011',
      latitude: 21.0401,
      longitude: 105.7949,
      openHours: '09:00 - 21:00',
      rating: 4.9,
      reviewCount: 58,
      tier: 'CERTIFIED',
      exclusiveOffer: 'Tặng dịch vụ xịt dưỡng chân tóc kích thích mọc tóc',
    },
    {
      name: 'Mộc Miên Spa & Beauty',
      slug: 'moc-mien-spa-vu-pham-ham',
      address: 'Số 45 Vũ Phạm Hàm, P. Yên Hòa, Cầu Giấy',
      ward: 'Yên Hòa',
      phone: '0912345012',
      latitude: 21.0134,
      longitude: 105.7989,
      openHours: '09:00 - 21:00',
      rating: 4.7,
      reviewCount: 22,
      tier: 'STANDARD',
      exclusiveOffer: 'Tặng đắp mặt nạ mắt thảo dược giảm quầng thâm',
    },
    {
      name: 'Nhã Trúc Hair & Relax',
      slug: 'nha-truc-hair-relax-trung-kinh',
      address: 'Số 116 Trung Kính, P. Trung Hòa, Cầu Giấy',
      ward: 'Trung Hòa',
      phone: '0912345013',
      latitude: 21.0175,
      longitude: 105.7932,
      openHours: '09:00 - 21:00',
      rating: 4.8,
      reviewCount: 37,
      tier: 'VERIFIED',
      exclusiveOffer: 'Tặng 10 phút cạo gió đầu lưu thông khí huyết',
    },
    {
      name: 'Thiền Dưỡng Spa Cầu Giấy',
      slug: 'thien-duong-spa-pham-van-dong',
      address: 'Số 15 Ngõ 234 Hoàng Quốc Việt, Cầu Giấy',
      ward: 'Nghĩa Tân',
      phone: '0912345014',
      latitude: 21.0489,
      longitude: 105.7891,
      openHours: '08:30 - 21:00',
      rating: 4.7,
      reviewCount: 18,
      tier: 'STANDARD',
      exclusiveOffer: 'Tặng xông hơi tinh dầu tràm gió',
    },
    {
      name: 'An Khang Dưỡng Sinh Đường',
      slug: 'an-khang-duong-sinh-le-van-luong',
      address: 'Tầng 2 Tòa 17T4 Hoàng Đạo Thúy, P. Trung Hòa, Cầu Giấy',
      ward: 'Trung Hòa',
      phone: '0912345015',
      latitude: 21.0062,
      longitude: 105.8021,
      openHours: '09:00 - 21:30',
      rating: 4.9,
      reviewCount: 63,
      tier: 'CERTIFIED',
      exclusiveOffer: 'Tặng 15 phút bài massage đá nóng lưng cổ',
    },
  ]

  const todayStr = new Date().toISOString().split('T')[0]

  for (const s of spas) {
    const createdSpa = await prisma.spa.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    })

    // Seed 3 time slots for today for each spa
    const slots = [
      { timeSlot: 'MORNING', isOffPeak: true, totalSeats: 4, bookedSeats: 1 },
      { timeSlot: 'AFTERNOON', isOffPeak: true, totalSeats: 5, bookedSeats: 2 },
      { timeSlot: 'EVENING', isOffPeak: false, totalSeats: 6, bookedSeats: 4 },
    ]

    for (const slot of slots) {
      await prisma.slot.upsert({
        where: {
          spaId_date_timeSlot: {
            spaId: createdSpa.id,
            date: todayStr,
            timeSlot: slot.timeSlot,
          },
        },
        update: {},
        create: {
          spaId: createdSpa.id,
          date: todayStr,
          ...slot,
        },
      })
    }
  }

  // 3. Seed some sample reviews with photos and verified phone
  const firstSpa = await prisma.spa.findFirst({ where: { slug: 'an-nhien-duong-sinh-cau-giay' } })
  if (firstSpa) {
    await prisma.review.createMany({
      data: [
        {
          spaId: firstSpa.id,
          customerPhone: '0989***123',
          customerName: 'Thu Trang (VP Cầu Giấy)',
          rating: 5,
          comment: 'Đúng giá 149k không bị thu thêm xu nào! Kỹ thuật viên làm đủ 65 phút, không hề chèo kéo mua thẻ hay mỹ phẩm. Cực kỳ ưng!',
          isOtpVerified: true,
        },
        {
          spaId: firstSpa.id,
          customerPhone: '0978***456',
          customerName: 'Minh Anh',
          rating: 5,
          comment: 'Đặt qua Zalo GlowBeautyPass trong 3 phút là có lịch. Đến nơi đọc tên là vào làm ngay.',
          isOtpVerified: true,
        },
      ],
    })
  }

  console.log('Seed completed successfully: 3 SKUs, 15 Spas, Slots & Initial Reviews created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
