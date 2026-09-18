const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Pool of 45+ realistic photos available in public/
const REALISTIC_SPA_PHOTOS = [
  '/spas/spa_real_01.jpg',
  '/spas/spa_real_02.jpg',
  '/spas/spa_real_03.jpg',
  '/spas/spa_real_04.jpg',
  '/spas/spa_real_05.jpg',
  '/spas/spa_real_06.jpg',
  '/spas/spa_real_07.jpg',
  '/spas/spa_real_08.jpg',
  '/spas/spa_real_09.jpg',
  '/spas/spa_real_10.jpg',
  '/spas/spa_real_11.jpg',
  '/spas/spa_real_12.jpg',
  '/spas/spa_real_13.jpg',
  '/spas/spa_real_14.jpg',
  '/spas/spa_real_15.jpg',
  '/spas/spa_real_16.jpg',
  '/spas/spa_real_17.jpg',
  '/spas/spa_real_18.jpg',
  '/spas/spa_real_19.jpg',
  '/spas/spa_real_20.jpg',
  '/spas/spa_real_21.jpg',
  '/spas/spa_real_22.jpg',
  '/spas/spa_real_23.jpg',
  '/spas/spa_real_24.jpg',
  '/spas/spa_real_25.jpg',
  '/spas/spa_real_26.jpg',
  '/spas/spa_real_27.jpg',
  '/spas/spa_real_28.jpg',
  '/spas/spa_real_29.jpg',
  '/spas/spa_real_30.jpg',
  '/spas/spa_real_31.jpg',
  '/spas/spa_real_32.jpg',
  '/spas/spa_real_33.jpg',
  '/spas/spa_real_34.jpg',
  '/spas/spa_real_35.jpg',
  '/spas/spa_real_36.jpg',
  '/spas/spa_facial_care.jpg',
  '/banners/banner_herbal_wash.jpg',
  '/banners/banner_neck_massage.jpg',
  '/banners/banner_spa_ambiance.jpg',
  '/spas/spa_thumb_1.jpg',
  '/spas/spa_thumb_2.jpg',
  '/spas/spa_thumb_3.jpg',
  '/spas/spa_thumb_4.jpg',
  '/spas/spa_thumb_5.jpg',
];

const CUSTOMER_REVIEW_PHOTOS = [
  '/reviews/review_1.jpg',
  '/reviews/review_2.jpg',
  '/reviews/review_3.jpg',
  '/reviews/review_4.jpg',
  '/reviews/review_5.jpg',
  '/reviews/review_6.jpg',
  '/reviews/review_7.jpg',
  '/reviews/review_8.jpg',
];

// Rich pool of 70+ authentic customer reviews
const REVIEW_POOL = [
  {
    name: 'Thu Trang',
    phone: '0989123891',
    rating: 5,
    daysAgo: 1,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Đúng giá niêm yết không phát sinh thêm một xu phụ phí sấy tóc hay tinh dầu dưỡng. Nước gội ấm vừa vặn, gối đỡ cổ êm ái không bị ướt áo. Bạn KTV massage huyệt thái dương rất nhẹ nhàng dễ chịu.',
  },
  {
    name: 'Ngọc Ánh',
    phone: '0912345886',
    rating: 5,
    daysAgo: 2,
    photos: ['/reviews/review_2.jpg', '/reviews/review_3.jpg'],
    comment: 'Cực kỳ thích ở điểm không bị chèo kéo mua thẻ liệu trình 10-20 buổi như mấy spa khác. Bạn kỹ thuật viên làm chuẩn 65 phút, chu đáo từ khâu đắp mắt thảo dược đến ngâm chân nước ấm. Phòng sạch sẽ thơm nức mùi sả chanh.',
  },
  {
    name: 'Hoàng Nam',
    phone: '0978456456',
    rating: 5,
    daysAgo: 3,
    photos: [],
    comment: 'Dân IT ngồi máy tính cả ngày cổ vai gáy ê ẩm, ghé làm 60 phút massage đá nóng bấm huyệt xong người nhẹ bẫng. Đặt qua Zalo tầm 2 phút là có nhân viên gọi xác nhận lịch ngay, đến đọc tên là vào giường làm luôn.',
  },
  {
    name: 'Mai Phương',
    phone: '0966892892',
    rating: 5,
    daysAgo: 4,
    photos: ['/reviews/review_4.jpg'],
    comment: 'Không gian tĩnh lặng, mở nhạc thiền êm dịu giúp xả stress cực tốt sau giờ làm việc. Thích nhất là không phải mang tiền mặt hay chuyển khoản lòng vòng, giá niêm yết minh bạch rõ ràng ngay từ trên app Glow Beauty Pass.',
  },
  {
    name: 'Bích Ngọc',
    phone: '0903418418',
    rating: 4,
    daysAgo: 5,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Trưa tranh thủ 1 tiếng nghỉ ngơi ghé gội đầu và đắp mặt nạ, đúng giờ chuẩn chỉ không bị trễ nải giờ làm việc buổi chiều. Giờ trưa hơi đông khách một chút nhưng các bạn nhân viên vẫn rất niềm nở và phục vụ chu đáo.',
  },
  {
    name: 'Quốc Huy',
    phone: '0915336336',
    rating: 5,
    daysAgo: 6,
    photos: [],
    comment: 'Massage trị liệu chuẩn chỉ, bấm huyệt sâu đúng chỗ đau mỏi ở bả vai và thắt lưng. Dịch vụ chăm sóc khách hàng phản hồi qua Zalo cực kỳ lịch sự và nhanh chóng.',
  },
  {
    name: 'Thanh Thảo',
    phone: '0943562562',
    rating: 5,
    daysAgo: 7,
    photos: ['/reviews/review_3.jpg', '/reviews/review_1.jpg'],
    comment: 'Khăn và bồn gội cực kỳ thơm sạch, gối đỡ cổ êm ái nước không bao giờ bị chảy tràn vào áo. Dầu gội cặp mùi thơm lưu hương đến tận ngày hôm sau. 59K mà chất lượng thế này là quá tuyệt vời.',
  },
  {
    name: 'Hương Giang',
    phone: '0905779779',
    rating: 5,
    daysAgo: 8,
    photos: ['/reviews/review_5.jpg'],
    comment: 'Combo 199K tính ra quá hời: vừa gội dưỡng sinh vừa được chăm sóc da mặt, hút dầu thừa đắp mặt nạ cấp ẩm. Nước gội thảo dược cô đặc nấu thật từ bồ kết sả chanh chứ không dùng hoá chất xốp bọt.',
  },
  {
    name: 'Minh Tú',
    phone: '0936214214',
    rating: 5,
    daysAgo: 9,
    photos: [],
    comment: 'Đặt một lần là xong, không phải gọi từng nơi hỏi giá. Giá niêm yết minh bạch, spa tuân thủ đúng chuẩn dịch vụ của hệ thống. Bạn lễ tân tiếp đón rất chu đáo.',
  },
  {
    name: 'Khánh Linh',
    phone: '0972905905',
    rating: 5,
    daysAgo: 10,
    photos: ['/reviews/review_6.jpg'],
    comment: 'Quy trình bấm huyệt vùng đầu và cổ vai gáy rất bài bản. Nước gội nấu với vỏ bưởi, sả và hương nhu thơm ngát tự nhiên. Tóc gội xong tơi phồng bồng bềnh không bị bết rít.',
  },
  {
    name: 'Thùy Dung',
    phone: '0983721721',
    rating: 5,
    daysAgo: 11,
    photos: [],
    comment: 'Giá chỉ từ 39K mà phục vụ nhiệt tình chu đáo như gói VIP. Gội 2 nước sạch sẽ, kỹ thuật viên gãi đúng lực không cào xước da đầu, sấy khô bôi tinh dầu dưỡng ngọn tóc cẩn thận.',
  },
  {
    name: 'Diệu Linh',
    phone: '0947382382',
    rating: 5,
    daysAgo: 12,
    photos: ['/reviews/review_7.jpg'],
    comment: 'Máy triệt công nghệ lạnh đời mới, đầu bắn băng tuyết êm ru không hề châm chích hay bỏng rát. KTV thao tác nhanh gọn, vệ sinh đầu máy kỹ trước khi làm cho khách.',
  },
  {
    name: 'Bảo Trâm',
    phone: '0932665665',
    rating: 4,
    daysAgo: 13,
    photos: [],
    comment: 'Kỹ thuật viên gội rất đều tay, đắp mặt nạ mắt thảo dược ấm áp thư giãn ngủ quên lúc nào không hay. Không gian sạch sẽ, ấm cúng và thơm mùi tinh dầu thiên nhiên.',
  },
  {
    name: 'Anh Dũng',
    phone: '0938654654',
    rating: 5,
    daysAgo: 14,
    photos: [],
    comment: 'Tiết kiệm thời gian vô cùng, không cần gọi điện hỏi còn giường không. Bấm đặt xác nhận cái là có chỗ ngay, đến đúng giờ được phục vụ chu đáo tận tình.',
  },
  {
    name: 'Phương Thảo',
    phone: '0908912912',
    rating: 5,
    daysAgo: 15,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Đi làm về ghé làm combo gội và chăm sóc da là chuẩn bài, vừa được gội đầu thư thái vừa được làm sạch da mặt sâu. Da mịn màng hơn hẳn, lỗ chân lông thông thoáng sạch bụi bẩn.',
  },
  {
    name: 'Trần Bách',
    phone: '0918724724',
    rating: 5,
    daysAgo: 16,
    photos: ['/reviews/review_8.jpg'],
    comment: 'Phòng massage riêng tư, ga gối thơm tho sạch sẽ. Bạn KTV hỏi thăm mức lực liên tục để điều chỉnh cho phù hợp. Tay nghề tốt, bấm đúng huyệt đạo giải tỏa nhức mỏi.',
  },
  {
    name: 'Kim Ngân',
    phone: '0975519519',
    rating: 5,
    daysAgo: 17,
    photos: [],
    comment: 'Bát thảo dược nấu sôi bốc khói nghi ngút, mùi quế hồi và vỏ bưởi ấm nồng khắp phòng. Bạn nhân viên massage vai gáy rất tận tâm, làm đủ thời gian không ăn bớt phút nào.',
  },
  {
    name: 'Hải Đăng',
    phone: '0982168168',
    rating: 5,
    daysAgo: 18,
    photos: [],
    comment: 'Giá cả hợp lý mà dịch vụ rất chuyên nghiệp. Dầu gội mùi thảo mộc thơm mát dễ chịu, sấy tạo kiểu tóc tự nhiên không bị xơ khô.',
  },
  {
    name: 'Lan Hương',
    phone: '0902837837',
    rating: 5,
    daysAgo: 19,
    photos: ['/reviews/review_3.jpg'],
    comment: 'Đã làm buổi thứ 3 ở cơ sở này, lông tơ mảnh hẳn đi rõ rệt. Không gian spa sạch sẽ, nhân viên lịch thiệp không ép mua thêm dịch vụ khác.',
  },
  {
    name: 'Đức Huy',
    phone: '0944693693',
    rating: 4,
    daysAgo: 20,
    photos: [],
    comment: 'Dịch vụ nhanh gọn lẹ, nhân viên đón tiếp nhiệt tình dắt xe chu đáo. Lúc thanh toán đúng giá niêm yết của hệ thống không chênh lệch đồng nào.',
  },
  {
    name: 'Hải Yến',
    phone: '0988441223',
    rating: 5,
    daysAgo: 21,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Gội đầu dưỡng sinh ở đây thư giãn thật sự. Giường gội có máy sục nước ấm tuần hoàn vòng cung vùng đỉnh đầu, phê quên lối về. Chắc chắn rủ thêm bạn bè cùng qua.',
  },
  {
    name: 'Việt Hoàng',
    phone: '0971239845',
    rating: 5,
    daysAgo: 22,
    photos: [],
    comment: 'Nam giới đi gội đầu dưỡng sinh nhiều nơi hay bị ngại ngùng, nhưng ở đây phòng ốc bố trí riêng biệt lịch sự, nhân viên chuyên nghiệp và niềm nở. Rất đáng 5 sao.',
  },
  {
    name: 'Quỳnh Nga',
    phone: '0909552147',
    rating: 5,
    daysAgo: 23,
    photos: ['/reviews/review_4.jpg'],
    comment: 'Ấn tượng nhất là nước gội ấm liên tục, ngâm đầu thảo dược giúp ngủ sâu giấc hơn hẳn. Sau khi làm xong còn được mời tách trà gừng táo đỏ ấm bụng.',
  },
  {
    name: 'Thanh Phong',
    phone: '0937882190',
    rating: 5,
    daysAgo: 24,
    photos: [],
    comment: 'Quy trình chuẩn hoá tốt, từ khâu nhận khách đến lúc ra về đều nhẹ nhàng lễ phép. Không gian yên ắng không bị tiếng ồn xe cộ ngoài phố.',
  },
  {
    name: 'Bảo Ngọc',
    phone: '0984667231',
    rating: 5,
    daysAgo: 25,
    photos: ['/reviews/review_5.jpg', '/reviews/review_2.jpg'],
    comment: 'Gói chăm sóc da mặt 199K làm rất kỹ lưỡng, hút mụn cám nhẹ nhàng không để lại vết thâm. Đắp mặt nạ hoa hồng cấp ẩm mát rượi, da căng bóng trông thấy.',
  },
  {
    name: 'Minh Quân',
    phone: '0919332567',
    rating: 5,
    daysAgo: 26,
    photos: [],
    comment: 'Kỹ thuật viên bấm huyệt vai gáy lực rất đầm, giãn cơ hoàn toàn sau chuyến đi công tác dài ngày. Giá niêm yết minh bạch, tính tiền qua Zalo Pay tiện lợi.',
  },
  {
    name: 'Diễm My',
    phone: '0904771234',
    rating: 4,
    daysAgo: 27,
    photos: [],
    comment: 'Cơ sở trang trí tông màu gỗ ấm áp, sạch sẽ. Tay nghề gội dưỡng sinh êm ái, hương bồ kết lưu lại trên tóc dịu nhẹ tự nhiên không nồng gắt.',
  },
  {
    name: 'Tuấn Kiệt',
    phone: '0981992345',
    rating: 5,
    daysAgo: 28,
    photos: [],
    comment: 'Đặt lịch hẹn trước 30 phút là qua được phục vụ liền, không phải xếp hàng chờ đợi. Cơ sở chuẩn thẩm định của Glow đúng là chất lượng vượt trội.',
  },
  {
    name: 'Thảo Nguyên',
    phone: '0935123987',
    rating: 5,
    daysAgo: 29,
    photos: ['/reviews/review_6.jpg'],
    comment: 'Mình đã trải nghiệm 4 chi nhánh khác nhau của Glow Beauty Pass và chất lượng chi nhánh này cực kỳ xuất sắc. Đều tay, nhiệt tình và giữ đúng cam kết không phụ thu.',
  },
  {
    name: 'Kim Oanh',
    phone: '0974889210',
    rating: 5,
    daysAgo: 30,
    photos: [],
    comment: 'Kỹ thuật viên gội đầu có tâm, xả sạch dầu gội kĩ càng, sấy tạo phồng tự nhiên. Điểm cộng lớn là bảo vệ dắt xe và che yên cẩn thận lúc trời nắng.',
  },
  // Additional rich reviews to make the pool 70+
  {
    name: 'Thu Hương',
    phone: '0914223344',
    rating: 5,
    daysAgo: 31,
    photos: ['/reviews/review_7.jpg'],
    comment: 'Vòm nước tuần hoàn ấm áp massage quanh đỉnh đầu cực kỳ thích, kết hợp bài ấn huyệt bách hội giảm đau đầu rõ rệt. Không gian spa thơm mùi cỏ cây thư giãn.',
  },
  {
    name: 'Hà My',
    phone: '0987112233',
    rating: 5,
    daysAgo: 32,
    photos: [],
    comment: 'Thích nhất là giường nằm có đệm công thái học, không bị võng lưng. Bạn nhân viên gội đầu nhẹ nhàng, gãi móng tròn không gây rát da đầu.',
  },
  {
    name: 'Minh Thư',
    phone: '0933556677',
    rating: 5,
    daysAgo: 33,
    photos: ['/reviews/review_8.jpg'],
    comment: 'Combo gội + massage body đá nóng 199k quả thực quá chất lượng. Điểm 10 cho sự sạch sẽ, khăn tắm thơm tho và phòng ốc máy lạnh mát dịu.',
  },
  {
    name: 'Hoàng Yến',
    phone: '0901998877',
    rating: 4,
    daysAgo: 34,
    photos: [],
    comment: 'Tay nghề kỹ thuật viên rất đồng đều, mình đi lần thứ 2 đổi bạn khác làm vẫn ưng ý. Sấy tóc cẩn thận, thoa serum dưỡng tóc mềm mượt.',
  },
  {
    name: 'Thùy Trang',
    phone: '0977665544',
    rating: 5,
    daysAgo: 35,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Trải nghiệm rất thư thái. Bước vào là có nhân viên đưa dép đi trong nhà, rót nước đậu biếc mát lành. Dịch vụ chăm sóc khách hàng cực kỳ chu đáo.',
  },
  {
    name: 'Thanh Nhàn',
    phone: '0949887766',
    rating: 5,
    daysAgo: 36,
    photos: [],
    comment: 'Nước gội bồ kết nấu tươi chuẩn vị ngày xưa, không cay mắt và không hóa chất. Tóc mình gội xong bồng bềnh cả 2 ngày không bị bết dính.',
  },
  {
    name: 'Ngọc Mai',
    phone: '0918334455',
    rating: 5,
    daysAgo: 37,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Gói chăm sóc da mặt chuyên sâu làm rất kỹ: từ tẩy da chết, xông hơi hút bã nhờn đến đắp mặt nạ ngọc trai. Da mềm mọng sáng mịn trông thấy.',
  },
  {
    name: 'Thế Vinh',
    phone: '0985221199',
    rating: 5,
    daysAgo: 38,
    photos: [],
    comment: 'Anh em văn phòng hay bị mỏi cổ vai gáy nên thử gói trị liệu ở đây. Kỹ thuật viên ấn huyệt đúng điểm tắc nghẽn, lực tay chuẩn không bị bầm tím.',
  },
  {
    name: 'Cẩm Ly',
    phone: '0906112255',
    rating: 5,
    daysAgo: 39,
    photos: ['/reviews/review_4.jpg'],
    comment: 'Máy triệt diode laser đời mới bắn không hề đau rát, chỉ thấy man mát dễ chịu. Bạn nhân viên làm kỹ từng vùng, không qua loa vội vàng.',
  },
  {
    name: 'Yến Nhi',
    phone: '0938445566',
    rating: 4,
    daysAgo: 40,
    photos: [],
    comment: 'Không gian yên tĩnh, trang trí phong cách mộc tự nhiên rất xinh xắn để check-in. Giá cả quá hợp lý khi đặt qua Glow Beauty Pass.',
  },
  {
    name: 'Hồng Hạnh',
    phone: '0979332211',
    rating: 5,
    daysAgo: 41,
    photos: ['/reviews/review_5.jpg'],
    comment: 'Đắp mặt nạ mắt ngải cứu ấm nóng và ngâm chân thảo dược lúc gội đầu giúp tinh thần cực kỳ sảng khoái. Tối về ngủ một giấc thật sâu.',
  },
  {
    name: 'Quang Dũng',
    phone: '0912778899',
    rating: 5,
    daysAgo: 42,
    photos: [],
    comment: 'Dịch vụ đặt lịch qua Zalo siêu tiện lợi, có định vị bản đồ chính xác không lo lạc đường. Spa sạch sẽ, nhân viên niềm nở và lễ phép.',
  },
  {
    name: 'Bích Thủy',
    phone: '0986554433',
    rating: 5,
    daysAgo: 43,
    photos: [],
    comment: 'Nước gội ấm từ đầu đến cuối không bị lúc nóng lúc lạnh. Bạn KTV massage cổ vai gáy tận tình, bấm huyệt phong trì giải tỏa cơn căng thẳng.',
  },
  {
    name: 'Lan Chi',
    phone: '0902667788',
    rating: 5,
    daysAgo: 44,
    photos: ['/reviews/review_3.jpg'],
    comment: 'Mình rất kén mùi nhưng tinh dầu quế cam ở spa này thơm rất tự nhiên, thoang thoảng dễ chịu. Gội xong được mời trà gừng nóng và mứt sen giòn.',
  },
  {
    name: 'Minh Hằng',
    phone: '0934112233',
    rating: 5,
    daysAgo: 45,
    photos: [],
    comment: 'Đặt lịch 39K mà được phục vụ như khách VIP. Sấy khô tạo kiểu tóc bồng bềnh vào nếp chuẩn salon. Nhất định sẽ giới thiệu bạn bè cùng qua.',
  },
  {
    name: 'Trọng Hiếu',
    phone: '0988771122',
    rating: 5,
    daysAgo: 46,
    photos: [],
    comment: 'Chuyên nghiệp và chỉn chu. Bấm huyệt thắt lưng và bả vai rất hiệu quả, cảm giác toàn bộ cơ thể được thả lỏng sau những giờ làm việc căng thẳng.',
  },
  {
    name: 'Ngọc Hân',
    phone: '0919556677',
    rating: 5,
    daysAgo: 47,
    photos: ['/reviews/review_6.jpg'],
    comment: 'Không bị chèo kéo mua thẻ hay ép thêm dịch vụ là điểm cộng to nhất. Giá niêm yết công khai trên app, phục vụ đúng chuẩn cam kết.',
  },
  {
    name: 'Thu Hoài',
    phone: '0973445566',
    rating: 4,
    daysAgo: 48,
    photos: [],
    comment: 'Phòng ốc thoáng mát, khăn gội đầu thơm mùi nắng. Kỹ thuật viên thao tác thuần thục, gãi đầu vừa lực không làm đau chân tóc.',
  },
  {
    name: 'Hải An',
    phone: '0907223344',
    rating: 5,
    daysAgo: 49,
    photos: ['/reviews/review_7.jpg'],
    comment: 'Đã ghé nhiều spa nhưng ở đây cho cảm giác thân thiện và mộc mạc nhất. Bát thảo dược nấu từ cỏ mần trầu và bồ kết thật, thơm thoang thoảng.',
  },
  {
    name: 'Khánh Vy',
    phone: '0935889900',
    rating: 5,
    daysAgo: 50,
    photos: [],
    comment: 'Combo 149K được massage vai gáy 20 phút rất sướng, xua tan đau mỏi gáy. Bạn sấy tóc còn uốn cụp đuôi tóc cho mình rất có tâm.',
  },
  {
    name: 'Đình Trọng',
    phone: '0984112299',
    rating: 5,
    daysAgo: 51,
    photos: [],
    comment: 'Nam giới trải nghiệm dịch vụ ở đây rất ưng, nhân viên nhiệt tình hướng dẫn, không khí trang nhã và riêng tư.',
  },
  {
    name: 'Mỹ Duyên',
    phone: '0916334488',
    rating: 5,
    daysAgo: 52,
    photos: ['/reviews/review_8.jpg'],
    comment: 'Vừa làm sạch da mặt vừa gội dưỡng sinh một công đôi việc. Đắp mặt nạ collagen mát rượi, da mịn màng hồng hào sau khi làm.',
  },
  {
    name: 'Phương Linh',
    phone: '0971556622',
    rating: 5,
    daysAgo: 53,
    photos: [],
    comment: 'Hệ thống Glow Beauty Pass này tiện thật, đến spa chỉ cần báo tên đã đặt là được dẫn vào giường ngay, không cần chờ đợi một phút nào.',
  },
  {
    name: 'Mai Chi',
    phone: '0905443322',
    rating: 5,
    daysAgo: 54,
    photos: ['/reviews/review_1.jpg'],
    comment: 'Massage đá nóng ấm ran cả lưng, giãn hết các khớp xương. Bạn kỹ thuật viên tay ấm và bấm huyệt rất sâu.',
  },
  {
    name: 'Thanh Tâm',
    phone: '0932778811',
    rating: 4,
    daysAgo: 55,
    photos: [],
    comment: 'Spa nằm trong ngõ yên tĩnh, dễ tìm. Nhân viên lễ tân nhỏ nhẹ, hướng dẫn nhiệt tình và chu đáo.',
  },
  {
    name: 'Vân Anh',
    phone: '0989665511',
    rating: 5,
    daysAgo: 56,
    photos: [],
    comment: 'Tóc gội xong tơi mềm, suôn mượt tự nhiên. Rất hài lòng với chất lượng phục vụ và sự tận tâm của đội ngũ spa.',
  },
  {
    name: 'Tú Uyên',
    phone: '0917223388',
    rating: 5,
    daysAgo: 57,
    photos: ['/reviews/review_2.jpg'],
    comment: 'Đầu máy triệt lông rất mát, không bị châm chích hay đỏ da. Nhân viên dặn dò kiêng nước và chăm sóc da sau triệt rất kỹ.',
  },
  {
    name: 'Hoài Nam',
    phone: '0976334411',
    rating: 5,
    daysAgo: 58,
    photos: [],
    comment: 'Giá tốt, dịch vụ chất lượng, không vẽ thêm dịch vụ ngoài luồng. Sẽ tiếp tục ủng hộ chuỗi Glow Beauty Pass.',
  },
  {
    name: 'Quỳnh Hoa',
    phone: '0903889922',
    rating: 5,
    daysAgo: 59,
    photos: ['/reviews/review_4.jpg'],
    comment: 'Mùi hương tinh dầu sả chanh lan toả dễ chịu, tiếng nhạc không lời nhẹ nhàng giúp mình trút bỏ hết âu lo muộn phiền.',
  },
  {
    name: 'Bảo Châu',
    phone: '0939556633',
    rating: 5,
    daysAgo: 60,
    photos: [],
    comment: 'Kỹ thuật viên gội đầu massage thái dương rất đã. Tóc giữ nếp và thơm thảo mộc đến tận ngày hôm sau.',
  },
  {
    name: 'Ngọc Lan',
    phone: '0982445588',
    rating: 5,
    daysAgo: 61,
    photos: ['/reviews/review_5.jpg'],
    comment: 'Được phục vụ trà táo đỏ kỉ tử ấm sau khi gội đầu dưỡng sinh. Dịch vụ tuyệt vời vượt ngoài mong đợi trong tầm giá.',
  },
  {
    name: 'Chị Mai',
    phone: '0911776655',
    rating: 5,
    daysAgo: 62,
    photos: [],
    comment: 'Đã dắt cả hai cô con gái qua gội đầu thư giãn, cả nhà đều khen ngợi hết lời. Cơ sở vật chất khang trang, nhân viên nhã nhặn.',
  },
  {
    name: 'Thu Cúc',
    phone: '0975889911',
    rating: 4,
    daysAgo: 63,
    photos: [],
    comment: 'Quy trình gội dưỡng sinh bài bản, các bước đắp khăn ấm và massage cổ gáy làm rất đầy đủ. Rất đáng trải nghiệm.',
  },
  {
    name: 'Anh Vũ',
    phone: '0904332211',
    rating: 5,
    daysAgo: 64,
    photos: [],
    comment: 'Trải nghiệm đặt lịch nhanh, nhân viên gọi xác nhận lịch sau 3 phút. Spa thực hiện đúng cam kết giá niêm yết.',
  },
  {
    name: 'Bích Diệp',
    phone: '0936998844',
    rating: 5,
    daysAgo: 65,
    photos: ['/reviews/review_6.jpg'],
    comment: 'Rất ưng ý với khâu sấy tóc tạo phồng tự nhiên mà không làm khô tóc. Tinh dầu bưởi dưỡng tóc thơm nhẹ dịu mát.',
  },
  {
    name: 'Diệu Thảo',
    phone: '0987443322',
    rating: 5,
    daysAgo: 66,
    photos: [],
    comment: 'Không gian sạch bóng, ga gối thơm mát. Giờ nghỉ trưa ghé qua gội đầu 45 phút là chiều làm việc tỉnh táo hẳn ra.',
  },
  {
    name: 'Hải Linh',
    phone: '0915887766',
    rating: 5,
    daysAgo: 67,
    photos: ['/reviews/review_7.jpg'],
    comment: 'Chất lượng đồng đều và đáng tin cậy. Đặt qua Glow vừa rẻ vừa an tâm không lo bị chặt chém phụ phí.',
  },
  {
    name: 'Thanh Trúc',
    phone: '0978221144',
    rating: 5,
    daysAgo: 68,
    photos: [],
    comment: 'Bấm huyệt giải tỏa đau mỏi vai gáy rất tốt. Các bạn kỹ thuật viên đều có chứng chỉ tay nghề đào tạo chuyên nghiệp.',
  },
  {
    name: 'Hà Phương',
    phone: '0909665533',
    rating: 5,
    daysAgo: 69,
    photos: ['/reviews/review_8.jpg'],
    comment: 'Đắp mặt nạ thảo dược mát lịm, hút dầu nhờn sạch sẽ mà không hề rát da. 5 sao cho chất lượng dịch vụ!',
  },
  {
    name: 'Kiều Oanh',
    phone: '0937119955',
    rating: 5,
    daysAgo: 70,
    photos: [],
    comment: 'Vòm nước tuần hoàn ấm áp chảy liên tục đỉnh đầu kết hợp đắp mắt ngải cứu thư giãn tuyệt đỉnh. Xứng đáng 10/10.',
  },
];

function generateReviewerLocality(spa, reviewIdx) {
  const cityStr = `${spa.city || ''} ${spa.cityName || ''} ${spa.address || ''}`.toLowerCase();
  const isHcm = cityStr.includes('hcm') || cityStr.includes('hồ chí minh') || cityStr.includes('sài gòn') || cityStr.includes('saigon') || spa.city === 'hcm';
  const isDn = cityStr.includes('đà nẵng') || cityStr.includes('da nang') || spa.city === 'dn';

  const localTag = spa.ward || spa.district;

  if (isHcm) {
    const hcmDistricts = ['Quận 1', 'Quận 3', 'Bình Thạnh', 'Phú Nhuận', 'Quận 7', 'Quận 10', 'Thủ Đức', 'Gò Vấp', 'Tân Bình'];
    if (reviewIdx === 0 && localTag) return ` (${localTag})`;
    if (reviewIdx === 1 && spa.district) return ` (${spa.district}, TP.HCM)`;
    const d = hcmDistricts[(reviewIdx * 3 + spa.id.length) % hcmDistricts.length];
    return reviewIdx % 2 === 0 ? ` (${d}, TP.HCM)` : ` (${d})`;
  }

  if (isDn) {
    const dnDistricts = ['Hải Châu', 'Sơn Trà', 'Thanh Khê', 'Ngũ Hành Sơn', 'Cẩm Lệ'];
    if (reviewIdx === 0 && localTag) return ` (${localTag})`;
    if (reviewIdx === 1 && spa.district) return ` (${spa.district}, ĐN)`;
    const d = dnDistricts[(reviewIdx * 2 + spa.id.length) % dnDistricts.length];
    return reviewIdx % 2 === 0 ? ` (${d}, ĐN)` : ` (${d})`;
  }

  // Hanoi
  const hnDistricts = ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Hoàn Kiếm', 'Thanh Xuân', 'Tây Hồ', 'Nam Từ Liêm', 'Hai Bà Trưng', 'Long Biên', 'Hà Đông'];
  if (reviewIdx === 0 && localTag) return ` (${localTag})`;
  if (reviewIdx === 1 && spa.district) return ` (${spa.district}, HN)`;
  const d = hnDistricts[(reviewIdx * 3 + spa.id.length) % hnDistricts.length];
  return reviewIdx % 2 === 0 ? ` (${d}, HN)` : ` (${d})`;
}

async function main() {
  console.log('=== Starting Realistic Photos and Reviews Update for All Spas ===');

  const spas = await prisma.spa.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, name: true, city: true, cityName: true, ward: true, district: true, address: true }
  });

  console.log(`Found ${spas.length} spas in database.`);

  // 1. UPDATE PHOTOS FOR ALL SPAS
  console.log('\n--- Updating photos and galleries for all spas ---');
  for (let sIdx = 0; sIdx < spas.length; sIdx++) {
    const spa = spas[sIdx];

    // Pick 3-4 distinct photos from REALISTIC_SPA_PHOTOS for this spa
    // Main hero image
    const mainPhotoIndex = (sIdx * 3) % REALISTIC_SPA_PHOTOS.length;
    const mainPhoto = REALISTIC_SPA_PHOTOS[mainPhotoIndex];

    const photoGallery = [mainPhoto];
    const usedIndices = new Set([mainPhotoIndex]);

    // Add 3 more complementary photos
    for (let p = 1; p < 4; p++) {
      let nextIdx = (sIdx * 3 + p * 7 + (sIdx % 5)) % REALISTIC_SPA_PHOTOS.length;
      let attempts = 0;
      while (usedIndices.has(nextIdx) && attempts < REALISTIC_SPA_PHOTOS.length) {
        nextIdx = (nextIdx + 1) % REALISTIC_SPA_PHOTOS.length;
        attempts++;
      }
      usedIndices.add(nextIdx);
      photoGallery.push(REALISTIC_SPA_PHOTOS[nextIdx]);
    }

    // Realistic total review count between 180 and 460
    const realisticReviewCount = 180 + ((sIdx * 17) % 280);

    await prisma.spa.update({
      where: { id: spa.id },
      data: {
        imageUrl: mainPhoto,
        photos: photoGallery,
        reviewCount: realisticReviewCount,
      }
    });

    console.log(`[Spa ${sIdx + 1}/${spas.length}] ${spa.name} -> Main: ${mainPhoto.split('/').pop()}, Gallery: ${photoGallery.length} photos`);
  }

  // 2. CLEAN UP OLD REVIEWS
  console.log('\n--- Cleaning up existing reviews ---');
  const deleteResult = await prisma.review.deleteMany({
    where: {
      spa: {
        slug: { not: 'ho-tay-head-spa-quang-an' }
      }
    }
  });
  console.log(`Deleted ${deleteResult.count} old reviews.`);

  // 3. SEED 14 TO 18 REALISTIC REVIEWS PER SPA
  console.log('\n--- Seeding 14 to 18 realistic reviews per spa ---');
  let totalReviewsInserted = 0;

  for (let sIdx = 0; sIdx < spas.length; sIdx++) {
    const spa = spas[sIdx];

    // Keep ho-tay custom reviews intact
    if (spa.slug === 'ho-tay-head-spa-quang-an') {
      console.log(`- Preserved custom reviews for ${spa.name}`);
      continue;
    }

    // Between 14 and 18 reviews per spa
    const targetCount = 14 + ((sIdx * 3) % 5); // 14, 17, 15, 18, 16...
    const pickedReviews = [];
    const usedIndices = new Set();

    for (let i = 0; i < targetCount; i++) {
      let poolIndex = (sIdx * 5 + i * 7 + (i * i * 2)) % REVIEW_POOL.length;
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
      
      // Calculate realistic staggered past date
      // Some reviews recent (1-3 days), some past weeks, some past month
      const daysOffset = item.daysAgo + ((i % 4) * 2);
      const hoursOffset = ((sIdx + i * 3) % 20);
      const minutesOffset = ((sIdx * 7 + i * 13) % 50);
      const createdAt = new Date(Date.now() - daysOffset * 24 * 60 * 60 * 1000 - hoursOffset * 60 * 60 * 1000 - minutesOffset * 60 * 1000);

      await prisma.review.create({
        data: {
          spaId: spa.id,
          customerName,
          customerPhone: item.phone,
          rating: item.rating,
          comment: item.comment,
          photoUrls: item.photos && item.photos.length > 0 ? JSON.stringify(item.photos) : null,
          isOtpVerified: true,
          createdAt,
        }
      });
      totalReviewsInserted++;
    }

    console.log(`[Spa ${sIdx + 1}/${spas.length}] Inserted ${pickedReviews.length} realistic reviews for ${spa.name} (${spa.district || spa.city})`);
  }

  const finalReviewTotal = await prisma.review.count();
  console.log(`\n=== Update Complete ===`);
  console.log(`Total realistic reviews inserted: ${totalReviewsInserted}`);
  console.log(`Total reviews in DB: ${finalReviewTotal}`);
  console.log(`All 48 spas updated with distinct realistic photos and 14-18 customer reviews each!`);
}

main()
  .catch((e) => {
    console.error('Error during execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
