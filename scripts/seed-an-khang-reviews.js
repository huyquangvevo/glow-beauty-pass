const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const slug = 'an-khang-duong-sinh-le-van-luong'

  const reviewBreakdown = {
    stars5: 58,
    stars4: 5,
    stars3: 0,
    stars2: 0,
    stars1: 0,
  }

  const reviewTags = [
    'Kỹ thuật viên tay nghề cao',
    'Không phụ thu phát sinh',
    'Không ép mua thẻ',
    'Không gian thư giãn yên tĩnh',
    'Trà thảo mộc thơm ngon',
    'Đúng quy trình SOP 65 phút',
  ]

  const curatedReviews = [
    {
      id: 'rev-ak-1',
      authorName: 'Thu Trang (VP Cầu Giấy)',
      authorInitials: 'TT',
      authorMeta: 'Đã trải nghiệm Gói Dưỡng Sinh 149k',
      body: 'Trải nghiệm gói Dưỡng Sinh Chuyên Sâu 149k cực kỳ đáng tiền! Kỹ thuật viên ấn huyệt và đả thông kinh lạc vùng cổ vai gáy rất chắc tay, làm đủ 65 phút không cắt xén thời gian. Đến nơi quét mã đặt trước qua Zalo là được phục vụ ngay, không phải chờ đợi.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      googleMapUrl: 'https://maps.google.com/?cid=123456789',
      stars: 5,
    },
    {
      id: 'rev-ak-2',
      authorName: 'Hoàng Nam (Khuất Duy Tiến)',
      authorInitials: 'HN',
      authorMeta: 'Đã trải nghiệm Gói Toàn Diện 69k',
      body: 'Mình làm việc máy tính nhiều nên hay bị đau mỏi vai gáy. Gói gội đầu và massage ở An Khang làm rất êm, dầu gội thảo dược thơm tự nhiên chứ không bị nồng mùi hóa chất. Rất hài lòng vì đúng giá niêm yết Glow Beauty Pass, không hề bị chèo kéo mua thẻ liệu trình.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      googleMapUrl: 'https://maps.google.com/?cid=123456789',
      stars: 5,
    },
    {
      id: 'rev-ak-3',
      authorName: 'Minh Anh (Hoàng Đạo Thúy)',
      authorInitials: 'MA',
      authorMeta: 'Khách quen Glow Beauty Pass',
      body: 'Không gian ở tầng 2 tòa 17T4 rất yên tĩnh, nhạc thiền thư thái. Nhân viên lễ phép và nhiệt tình. Được tặng thêm 15 phút massage đá nóng theo ưu đãi độc quyền của Glow. Sẽ tiếp tục quay lại hàng tuần!',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      googleMapUrl: '',
      stars: 5,
    },
    {
      id: 'rev-ak-4',
      authorName: 'David Lee (Expat Hanoi)',
      authorInitials: 'DL',
      authorMeta: 'Verified Google Review',
      body: 'First time trying Vietnamese herbal hair wash & acupressure massage here. Outstanding service, very clean facilities and genuine hospitality. The therapist relieved all tension in my neck and shoulders. Highly recommended!',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      googleMapUrl: 'https://maps.google.com/?cid=123456789',
      stars: 5,
    },
  ]

  const faqs = [
    {
      question: 'Đặt lịch qua Glow Beauty Pass tại An Khang Dưỡng Sinh có cần thanh toán trước không?',
      answer: 'Bạn không cần thanh toán trước. Bạn chỉ cần chọn khung giờ và xác nhận lịch hẹn qua Zalo Hub hoặc Hotline, đến spa đọc mã đặt chỗ là được phục vụ ngay và thanh toán đúng giá niêm yết tại quầy.',
    },
    {
      question: 'Gói dịch vụ có bị phụ thu cuối tuần hoặc giờ cao điểm không?',
      answer: 'Cam kết 100% không phụ thu cuối tuần, không phụ thu giờ cao điểm và không ép buộc tiền tip. Tất cả đối tác trong mạng lưới Glow Beauty Pass đều ký cam kết tuân thủ chính sách giá chuẩn hóa.',
    },
    {
      question: 'Địa chỉ cơ sở tại 17T4 Hoàng Đạo Thúy có chỗ đỗ ô tô và xe máy không?',
      answer: 'Cơ sở nằm tại Tầng 2 Tòa 17T4 Hoàng Đạo Thúy, có bãi đỗ xe máy thuận tiện và tầng hầm gửi xe ô tô rộng rãi, bảo vệ an ninh 24/7.',
    },
  ]

  const updated = await prisma.spa.update({
    where: { slug },
    data: {
      reviewSectionTitle: 'Khách hàng nói gì về chúng tôi',
      reviewSectionSubtitle: 'Đánh giá từ trải nghiệm dịch vụ thực tế của khách hàng tại cơ sở',
      reviewBreakdown,
      reviewTags,
      curatedReviews,
      faqs,
      rating: 4.9,
      reviewCount: 63,
    },
  })

  console.log('Successfully updated An Khang spa reviews:', updated.slug)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
