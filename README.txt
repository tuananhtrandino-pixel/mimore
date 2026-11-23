BOL — BOX OF LOVE | WEBSITE DEMO
================================

CÁCH MỞ WEBSITE
1. Giải nén toàn bộ thư mục BOL_Box_of_Love.
2. Mở Visual Studio Code → File → Open Folder → chọn thư mục BOL_Box_of_Love.
3. Cài extension Live Server (nếu máy chưa có).
4. Mở index.html → nhấn chuột phải → Open with Live Server.
5. Website mở ở trang chủ. Dùng menu để đi đến Cửa hàng, Về BOL, Giỏ hàng.

CÁC TRANG
- index.html         Trang chủ
- shop.html          Cửa hàng: tìm kiếm, lọc, sắp xếp, xem chi tiết, thêm giỏ
- about.html         Câu chuyện về BOL
- cart.html          Giỏ hàng: tăng/giảm số lượng, xóa, tính tổng
- checkout.html      Thông tin nhận hàng, xác nhận đơn COD mô phỏng
- order-success.html Xác nhận đơn hàng demo
- Cuahang.html       Đường dẫn tương thích, tự chuyển sang shop.html

DỮ LIỆU VÀ LƯU TRỮ
- products.json chứa 200 sản phẩm demo được cung cấp trong dự án.
- Giỏ hàng lưu bằng localStorage trên chính trình duyệt đang dùng.
- Đơn hàng mô phỏng lưu trong localStorage (bol-last-order và bol-orders).
- Giá trong products.json là giá demo; cần xác minh trước khi bán thật.
- Không có cổng thanh toán, backend, gửi email hay xử lý đơn hàng thật.

LƯU Ý
- Luôn chạy qua Live Server hoặc máy chủ tĩnh tương tự; không mở HTML trực tiếp bằng file://.
- Giữ products.json cùng cấp với các file HTML và JavaScript.
- Không đổi tên file nếu chưa cập nhật các đường dẫn liên quan.
- Nếu muốn xóa dữ liệu thử nghiệm, mở DevTools → Application → Local Storage và xóa các khóa bol-cart, bol-cart-v2, bol-orders, bol-last-order.
