# Funio Store

Trang web **Funio** là một website bán hàng trực tuyến chuyên bán các sản phẩm nội thất. Dưới đây là các tính năng mà người dùng có thể trải nghiệm khi đăng nhập vào trang web này.

Những tính năng này cải thiện trải nghiệm mua sắm, giúp người dùng dễ dàng quản lý các đơn hàng và thông tin cá nhân của mình.

## User Stories

### 1. Tài khoản cá nhân (User Account)

- **Quản lý thông tin cá nhân**: Sau khi đăng nhập, người dùng có thể cập nhật và quản lý thông tin cá nhân như tên, địa chỉ email, địa chỉ giao hàng, và số điện thoại.

### 2. Xem lịch sử đơn hàng (Order History)

- **Theo dõi đơn hàng**: Người dùng có thể xem lịch sử mua hàng và tình trạng của các đơn hàng đã đặt (đã xử lý, đã hoàn thành).
- **Chi tiết đơn hàng**: Cung cấp thông tin chi tiết về các sản phẩm đã mua, số lượng, giá cả và thời gian mua hàng.

### 3. Giỏ hàng (Shopping Cart)

- **Thêm sản phẩm vào giỏ**: Người dùng có thể thêm sản phẩm vào giỏ hàng khi duyệt qua các danh mục.
- **Chỉnh sửa giỏ hàng**: Sau khi thêm vào giỏ, họ có thể chỉnh sửa số lượng sản phẩm, xóa sản phẩm khỏi giỏ hàng hoặc tính toán lại tổng giá trị đơn hàng.
- **Thanh toán**: Người dùng có thể thanh toán từ trang giỏ hàng và nhập thông tin thanh toán.

### 4. Tùy chỉnh sản phẩm (Product Customization)

Đối với một số sản phẩm, người dùng có thể filter trực tiếp trên trang sản phẩm trước khi thêm vào giỏ hàng.

### 5. Đánh giá sản phẩm (Product Reviews)

Sau khi mua sản phẩm, người dùng có thể để lại đánh giá hoặc nhận xét về sản phẩm. Điều này giúp người dùng khác có thêm thông tin tham khảo trước khi mua.

### 8. Hỗ trợ khách hàng (Contact Support)

Người dùng có thể liên hệ hỗ trợ thông qua hệ thống hỗ trợ trực tuyến, chat hoặc email.

# Endpoint APIs

## 1. Tài khoản cá nhân (User Account)

### Route: POST /api/auth/register

- **Description:** Tạo tài khoản người dùng mới.
- **Body Parameters:**
  - `name` (string): Tên của người dùng.
  - `email` (string): Địa chỉ email của người dùng.
  - `password` (string): Mật khẩu người dùng.
  - `address` (string): Địa chỉ giao hàng.
  - `phoneNumber` (string): Số điện thoại của người dùng.
- **Access:** Public

### Route: POST /api/auth/login

- **Description:** Đăng nhập và nhận mã thông báo JWT.
- **Body Parameters:**
  - `email` (string): Địa chỉ email đã đăng ký.
  - `password` (string): Mật khẩu đã đăng ký.
- **Access:** Public

### Route: PUT /api/user/profile

- **Description:** Cập nhật thông tin cá nhân của người dùng.
- **Body Parameters:**
  - `name` (string): Họ tên người dùng.
  - `email` (string): Địa chỉ email mới (tùy chọn).
  - `address` (string): Địa chỉ giao hàng mới (tùy chọn).
  - `phoneNumber` (string): Số điện thoại mới (tùy chọn).
- **Access:** Private (Yêu cầu token)

## 2. Xem lịch sử đơn hàng (Order History)

### Route: GET /api/orders

- **Description:** Trả về danh sách các đơn hàng của người dùng.
- **Access:** Private (Yêu cầu token)

### Route: GET /api/orders/{orderId}

- **Description:** Xem chi tiết đơn hàng cụ thể.
- **Path Parameters:**
  - `orderId` (string): ID của đơn hàng.
- **Access:** Private (Yêu cầu token)

## 3. Danh sách yêu thích (Wishlist)

### Route: POST /api/wishlist

- **Description:** Thêm sản phẩm vào danh sách yêu thích.
- **Body Parameters:**
  - `productId` (string): ID của sản phẩm.
- **Access:** Private (Yêu cầu token)

### Route: GET /api/wishlist

- **Description:** Xem danh sách yêu thích của người dùng.
- **Access:** Private (Yêu cầu token)

### Route: DELETE /api/wishlist/{productId}

- **Description:** Xóa sản phẩm khỏi danh sách yêu thích.
- **Path Parameters:**
  - `productId` (string): ID của sản phẩm cần xóa.
- **Access:** Private (Yêu cầu token)

## 4. Tùy chỉnh sản phẩm (Product Customization)

### Route: GET /api/products/{productId}/customization-options

- **Description:** Lấy các tùy chọn tùy chỉnh cho sản phẩm.
- **Path Parameters:**
  - `productId` (string): ID của sản phẩm.
- **Access:** Public

### Route: POST /api/cart/{productId}/customization

- **Description:** Lưu các tùy chỉnh sản phẩm vào giỏ hàng.
- **Body Parameters:**
  - `customization` (object): Các tùy chọn tùy chỉnh (màu sắc, kích thước, chất liệu).
- **Access:** Private (Yêu cầu token)

## 5. Đánh giá sản phẩm (Product Reviews)

### Route: POST /api/reviews

- **Description:** Thêm đánh giá sản phẩm sau khi mua.
- **Body Parameters:**
  - `productId` (string): ID của sản phẩm.
  - `review` (string): Nội dung đánh giá.
  - `rating` (number): Điểm số (1-5).
- **Access:** Private (Yêu cầu token)

### Route: GET /api/products/{productId}/reviews

- **Description:** Xem các đánh giá của sản phẩm.
- **Path Parameters:**
  - `productId` (string): ID của sản phẩm.
- **Access:** Public

## 6. Chính sách đổi/trả hàng (Return/Exchange Policies)

### Route: POST /api/orders/{orderId}/return

- **Description:** Gửi yêu cầu đổi/trả hàng.
- **Path Parameters:**
  - `orderId` (string): ID của đơn hàng.
- **Body Parameters:**
  - `reason` (string): Lý do đổi/trả hàng.
- **Access:** Private (Yêu cầu token)

### Route: GET /api/orders/{orderId}/return-status

- **Description:** Xem trạng thái yêu cầu đổi/trả hàng.
- **Path Parameters:**
  - `orderId` (string): ID của đơn hàng.
- **Access:** Private (Yêu cầu token)

## 7. Hỗ trợ khách hàng (Customer Support)

### Route: POST /api/support

- **Description:** Gửi yêu cầu hỗ trợ khách hàng.
- **Body Parameters:**
  - `orderId` (string): ID của đơn hàng (nếu có).
  - `message` (string): Nội dung yêu cầu hỗ trợ.
- **Access:** Private (Yêu cầu token)

### Route: GET /api/support/{ticketId}

- **Description:** Xem trạng thái xử lý yêu cầu hỗ trợ.
- **Path Parameters:**
  - `ticketId` (string): ID của yêu cầu hỗ trợ.
- **Access:** Private (Yêu cầu token)
