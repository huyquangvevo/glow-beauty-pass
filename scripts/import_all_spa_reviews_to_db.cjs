const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REVIEW_POOL = [
  {
    name: 'Thu Trang',
    phone: '0989123891',
    rating: 5,
    daysAgo: 2,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Đúng giá niêm yết không phát sinh thêm một xu phụ phí sấy tóc hay tinh dầu dưỡng. Nước gội ấm vừa vặn, gối đỡ cổ êm ái không bị ướt áo. Bạn KTV massage huyệt thái dương rất nhẹ nhàng dễ chịu.',
  },
  {
    name: 'Ngọc Ánh',
    phone: '0912345886',
    rating: 5,
    daysAgo: 3,
    photos: ['/reviews/review_2.jpg', '/reviews/review_3.jpg'],
    comment: 'Cực kỳ thích ở điểm không bị chèo kéo mua thẻ liệu trình 10-20 buổi như mấy spa khác. Bạn kỹ thuật viên làm chuẩn 65 phút, chu đáo từ khâu đắp mắt thảo dược đến ngâm chân nước ấm. Phòng sạch sẽ thơm nức mùi sả chanh.',
  },
  {
    name: 'Hoàng Nam',
    phone: '0978456456',
    rating: 5,
    daysAgo: 5,
    photos: [],
    comment: 'Dân IT ngồi máy tính cả ngày cổ vai gáy ê ẩm, ghé làm 60 phút massage đá nóng bấm huyệt xong người nhẹ bẫng. Đặt qua Zalo tầm 2 phút là có nhân viên gọi xác nhận lịch ngay, đến đọc tên là vào giường làm luôn.',
  },
  {
    name: 'Mai Phương',
    phone: '0966892892',
    rating: 5,
    daysAgo: 6,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Không gian tĩnh lặng, mở nhạc thiền êm dịu giúp xả stress cực tốt sau giờ làm việc. Thích nhất là không phải mang tiền mặt hay chuyển khoản lòng vòng, giá niêm yết minh bạch rõ ràng ngay từ trên app Glow Beauty Pass.',
  },
  {
    name: 'Bích Ngọc',
    phone: '0903418418',
    rating: 4,
    daysAgo: 7,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Trưa tranh thủ 1 tiếng nghỉ ngơi ghé gội đầu và đắp mặt nạ, đúng giờ chuẩn chỉ không bị trễ nải giờ làm việc buổi chiều. Giờ trưa hơi đông khách một chút nhưng các bạn nhân viên vẫn rất niềm nở và phục vụ chu đáo.',
  },
  {
    name: 'Quốc Huy',
    phone: '0915336336',
    rating: 5,
    daysAgo: 9,
    photos: [],
    comment: 'Massage trị liệu chuẩn chỉ, bấm huyệt sâu đúng chỗ đau mỏi ở bả vai và thắt lưng. Dịch vụ chăm sóc khách hàng phản hồi qua Zalo cực kỳ lịch sự và nhanh chóng.',
  },
  {
    name: 'Thanh Thảo',
    phone: '0943562562',
    rating: 5,
    daysAgo: 10,
    photos: ['/reviews/review_3.jpg', '/reviews/review_1.jpg'],
    comment: 'Khăn và bồn gội cực kỳ thơm sạch, gối đỡ cổ êm ái nước không bao giờ bị chảy tràn vào áo. Dầu gội cặp mùi thơm lưu hương đến tận ngày hôm sau. 59K mà chất lượng thế này là quá tuyệt vời.',
  },
  {
    name: 'Hương Giang',
    phone: '0905779779',
    rating: 5,
    daysAgo: 12,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Combo 199K tính ra quá hời: vừa gội dưỡng sinh vừa được chăm sóc da mặt, hút dầu thừa đắp mặt nạ cấp ẩm. Nước gội thảo dược cô đặc nấu thật từ bồ kết sả chanh chứ không dùng hoá chất xốp bọt.',
  },
  {
    name: 'Minh Tú',
    phone: '0936214214',
    rating: 5,
    daysAgo: 13,
    photos: [],
    comment: 'Đặt một lần là xong, không phải gọi từng nơi hỏi giá. Giá niêm yết minh bạch, spa tuân thủ đúng chuẩn dịch vụ của hệ thống. Bạn lễ tân tiếp đón rất chu đáo.',
  },
  {
    name: 'Khánh Linh',
    phone: '0972905905',
    rating: 5,
    daysAgo: 15,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Quy trình bấm huyệt vùng đầu và cổ vai gáy rất bài bản. Nước gội nấu với vỏ bưởi, sả và hương nhu thơm ngát tự nhiên. Tóc gội xong tơi phồng bồng bềnh không bị bết rít.',
  },
  {
    name: 'Thùy Dung',
    phone: '0983721721',
    rating: 5,
    daysAgo: 17,
    photos: [],
    comment: 'Giá chỉ từ 39K mà phục vụ nhiệt tình chu đáo như gói VIP. Gội 2 nước sạch sẽ, kỹ thuật viên gãi đúng lực không cào xước da đầu, sấy khô bôi tinh dầu dưỡng ngọn tóc cẩn thận.',
  },
  {
    name: 'Diệu Linh',
    phone: '0947382382',
    rating: 5,
    daysAgo: 19,
    photos: ['/reviews/review_3.jpg'],
    comment: 'Máy triệt công nghệ lạnh đời mới, đầu bắn băng tuyết êm ru không hề châm chích hay bỏng rát. KTV thao tác nhanh gọn, vệ sinh đầu máy kỹ trước khi làm cho khách.',
  },
  {
    name: 'Bảo Trâm',
    phone: '0932665665',
    rating: 4,
    daysAgo: 21,
    photos: [],
    comment: 'Kỹ thuật viên gội rất đều tay, đắp mặt nạ mắt thảo dược ấm áp thư giãn ngủ quên lúc nào không hay. Không gian sạch sẽ, ấm cúng và thơm mùi tinh dầu thiên nhiên.',
  },
  {
    name: 'Anh Dũng',
    phone: '0938654654',
    rating: 5,
    daysAgo: 22,
    photos: [],
    comment: 'Tiết kiệm thời gian vô cùng, không cần gọi điện hỏi còn giường không. Bấm đặt xác nhận cái là có chỗ ngay, đến đúng giờ được phục vụ chu đáo tận tình.',
  },
  {
    name: 'Phương Thảo',
    phone: '0908912912',
    rating: 5,
    daysAgo: 24,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Đi làm về ghé làm combo gội và chăm sóc da là chuẩn bài, vừa được gội đầu thư thái vừa được làm sạch da mặt sâu. Da mịn màng hơn hẳn, lỗ chân lông thông thoáng sạch bụi bẩn.',
  },
  {
    name: 'Trần Bách',
    phone: '0918724724',
    rating: 5,
    daysAgo: 26,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Phòng massage riêng tư, ga gối thơm tho sạch sẽ. Bạn KTV hỏi thăm mức lực liên tục để điều chỉnh cho phù hợp. Tay nghề tốt, bấm đúng huyệt đạo giải tỏa nhức mỏi.',
  },
  {
    name: 'Kim Ngân',
    phone: '0975519519',
    rating: 5,
    daysAgo: 28,
    photos: [],
    comment: 'Bát thảo dược nấu sôi bốc khói nghi ngút, mùi quế hồi và vỏ bưởi ấm nồng khắp phòng. Bạn nhân viên massage vai gáy rất tận tâm, làm đủ thời gian không ăn bớt phút nào.',
  },
  {
    name: 'Hải Đăng',
    phone: '0982168168',
    rating: 5,
    daysAgo: 30,
    photos: [],
    comment: 'Giá cả hợp lý mà dịch vụ rất chuyên nghiệp. Dầu gội mùi thảo mộc thơm mát dễ chịu, sấy tạo kiểu tóc tự nhiên không bị xơ khô.',
  },
  {
    name: 'Lan Hương',
    phone: '0902837837',
    rating: 5,
    daysAgo: 33,
    photos: ['/reviews/review_3.jpg'],
    comment: 'Đã làm buổi thứ 3 ở cơ sở này, lông tơ mảnh hẳn đi rõ rệt. Không gian spa sạch sẽ, nhân viên lịch thiệp không ép mua thêm dịch vụ khác.',
  },
  {
    name: 'Đức Huy',
    phone: '0944693693',
    rating: 4,
    daysAgo: 35,
    photos: [],
    comment: 'Dịch vụ nhanh gọn lẹ, nhân viên đón tiếp nhiệt tình dắt xe chu đáo. Lúc thanh toán đúng giá niêm yết của hệ thống không chênh lệch đồng nào.',
  },
  {
    name: 'Hải Yến',
    phone: '0988441223',
    rating: 5,
    daysAgo: 4,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Gội đầu dưỡng sinh ở đây thư giãn thật sự. Giường gội có máy sục nước ấm tuần hoàn vòng cung vùng đỉnh đầu, phê quên lối về. Chắc chắn rủ thêm bạn bè cùng qua.',
  },
  {
    name: 'Việt Hoàng',
    phone: '0971239845',
    rating: 5,
    daysAgo: 8,
    photos: [],
    comment: 'Nam giới đi gội đầu dưỡng sinh nhiều nơi hay bị ngại ngùng, nhưng ở đây phòng ốc bố trí riêng biệt lịch sự, nhân viên chuyên nghiệp và niềm nở. Rất đáng 5 sao.',
  },
  {
    name: 'Quỳnh Nga',
    phone: '0909552147',
    rating: 5,
    daysAgo: 11,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Ấn tượng nhất là nước gội ấm liên tục, ngâm đầu thảo dược giúp ngủ sâu giấc hơn hẳn. Sau khi làm xong còn được mời tách trà gừng táo đỏ ấm bụng.',
  },
  {
    name: 'Thanh Phong',
    phone: '0937882190',
    rating: 5,
    daysAgo: 14,
    photos: [],
    comment: 'Quy trình chuẩn hoá tốt, từ khâu nhận khách đến lúc ra về đều nhẹ nhàng lễ phép. Không gian yên ắng không bị tiếng ồn xe cộ ngoài phố.',
  },
  {
    name: 'Bảo Ngọc',
    phone: '0984667231',
    rating: 5,
    daysAgo: 16,
    photos: ['/reviews/review_3.jpg', '/reviews/review_2.jpg'],
    comment: 'Gói chăm sóc da mặt 199K làm rất kỹ lưỡng, hút mụn cám nhẹ nhàng không để lại vết thâm. Đắp mặt nạ hoa hồng cấp ẩm mát rượi, da căng bóng trông thấy.',
  },
  {
    name: 'Minh Quân',
    phone: '0919332567',
    rating: 5,
    daysAgo: 18,
    photos: [],
    comment: 'Kỹ thuật viên bấm huyệt vai gáy lực rất đầm, giãn cơ hoàn toàn sau chuyến đi công tác dài ngày. Giá niêm yết minh bạch, tính tiền qua Zalo Pay tiện lợi.',
  },
  {
    name: 'Diễm My',
    phone: '0904771234',
    rating: 4,
    daysAgo: 23,
    photos: [],
    comment: 'Cơ sở trang trí tông màu gỗ ấm áp, sạch sẽ. Tay nghề gội dưỡng sinh êm ái, hương bồ kết lưu lại trên tóc dịu nhẹ tự nhiên không nồng gắt.',
  },
  {
    name: 'Tuấn Kiệt',
    phone: '0981992345',
    rating: 5,
    daysAgo: 27,
    photos: [],
    comment: 'Đặt lịch hẹn trước 30 phút là qua được phục vụ liền, không phải xếp hàng chờ đợi. Cơ sở chuẩn thẩm định của Glow đúng là chất lượng vượt trội.',
  },
  {
    name: 'Thảo Nguyên',
    phone: '0935123987',
    rating: 5,
    daysAgo: 31,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Mình đã trải nghiệm 4 chi nhánh khác nhau của Glow Beauty Pass và chất lượng chi nhánh này cực kỳ xuất sắc. Đều tay, nhiệt tình và giữ đúng cam kết không phụ thu.',
  },
  {
    name: 'Kim Oanh',
    phone: '0974889210',
    rating: 5,
    daysAgo: 36,
    photos: [],
    comment: 'Kỹ thuật viên gội đầu có tâm, xả sạch dầu gội kĩ càng, sấy tạo phồng tự nhiên. Điểm cộng lớn là bảo vệ dắt xe và che yên cẩn thận lúc trời nắng.',
  },
];

function generateReviewerLocality(spa, reviewIdx) {
  const cityStr = `${spa.city || ''} ${spa.cityName || ''} ${spa.address || ''}`.toLowerCase();
  const isHcm = cityStr.includes('hcm') || cityStr.includes('hồ chí minh') || cityStr.includes('sài gòn') || cityStr.includes('saigon');
  const isDn = cityStr.includes('đà nẵng') || cityStr.includes('da nang') || spa.city === 'dn';

  // Specific local tag from spa ward or district
  const localTag = spa.ward || spa.district;

  if (isHcm) {
    const hcmDistricts = ['Quận 1', 'Quận 3', 'Bình Thạnh', 'Phú Nhuận', 'Quận 7', 'Quận 10', 'Thủ Đức'];
    if (reviewIdx === 0 && localTag) return ` (${localTag})`;
    if (reviewIdx === 1 && spa.district) return ` (${spa.district}, TP.HCM)`;
    const d = hcmDistricts[(reviewIdx * 3 + spa.id.length) % hcmDistricts.length];
    return reviewIdx % 2 === 0 ? ` (${d}, TP.HCM)` : ` (${d})`;
  }

  if (isDn) {
    const dnDistricts = ['Hải Châu', 'Sơn Trà', 'Thanh Khê', 'Ngũ Hành Sơn'];
    if (reviewIdx === 0 && localTag) return ` (${localTag})`;
    if (reviewIdx === 1 && spa.district) return ` (${spa.district}, ĐN)`;
    const d = dnDistricts[(reviewIdx * 2 + spa.id.length) % dnDistricts.length];
    return reviewIdx % 2 === 0 ? ` (${d}, ĐN)` : ` (${d})`;
  }

  // Hanoi
  const hnDistricts = ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Hoàn Kiếm', 'Thanh Xuân', 'Tây Hồ', 'Nam Từ Liêm', 'Hai Bà Trưng'];
  if (reviewIdx === 0 && localTag) return ` (${localTag})`;
  if (reviewIdx === 1 && spa.district) return ` (${spa.district}, HN)`;
  const d = hnDistricts[(reviewIdx * 3 + spa.id.length) % hnDistricts.length];
  return reviewIdx % 2 === 0 ? ` (${d}, HN)` : ` (${d})`;
}

async function main() {
  console.log('=== Starting Distinct Reviews Import for All Spas ===');

  const spas = await prisma.spa.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, name: true, city: true, cityName: true, ward: true, district: true, address: true }
  });

  console.log(`Found ${spas.length} spas in database.`);

  // Delete all reviews except ho-tay-head-spa-quang-an to re-seed cleanly and ensure 100% variety
  const deleteResult = await prisma.review.deleteMany({
    where: {
      spa: {
        slug: { not: 'ho-tay-head-spa-quang-an' }
      }
    }
  });
  console.log(`Cleaned up old test reviews (deleted ${deleteResult.count}).`);

  let totalInserted = 0;

  for (let sIdx = 0; sIdx < spas.length; sIdx++) {
    const spa = spas[sIdx];

    // Keep ho-tay custom reviews
    if (spa.slug === 'ho-tay-head-spa-quang-an') {
      console.log(`- Kept custom reviews for ${spa.name}`);
      continue;
    }

    const reviewCount = (sIdx % 2 === 0) ? 5 : 4;
    const pickedReviews = [];
    const usedIndices = new Set();

    // Stagger rotation so every single spa gets a different combination
    for (let i = 0; i < reviewCount; i++) {
      let poolIndex = (sIdx * 7 + i * 11 + (i * i * 3)) % REVIEW_POOL.length;
      let attempts = 0;
      while (usedIndices.has(poolIndex) && attempts < REVIEW_POOL.length) {
        poolIndex = (poolIndex + 1) % REVIEW_POOL.length;
        attempts++;
      }
      usedIndices.add(poolIndex);
      pickedReviews.push({ ...REVIEW_POOL[poolIndex], reviewOrder: i });
    }

    for (let i = 0; i < pickedReviews.length; i++) {
      const item = pickedReviews[i];
      const locality = generateReviewerLocality(spa, i);
      const customerName = `${item.name}${locality}`;
      const createdAt = new Date(Date.now() - item.daysAgo * 24 * 60 * 60 * 1000 - ((sIdx + i) % 18) * 60 * 60 * 1000);

      await prisma.review.create({
        data: {
          spaId: spa.id,
          customerName,
          customerPhone: item.phone,
          rating: item.rating,
          comment: item.comment,
          photoUrls: JSON.stringify(item.photos),
          isOtpVerified: true,
          createdAt,
        }
      });
      totalInserted++;
    }

    console.log(`[${sIdx + 1}/${spas.length}] Inserted ${pickedReviews.length} unique reviews for ${spa.name} (${spa.ward || spa.district || spa.city})`);
  }

  const finalTotal = await prisma.review.count();
  console.log(`\n=== Seeding Finished Successfully ===`);
  console.log(`New reviews inserted: ${totalInserted}`);
  console.log(`Total reviews in DB: ${finalTotal}`);
}

main()
  .catch((e) => {
    console.error('Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
