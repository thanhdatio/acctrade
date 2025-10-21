# 🚀 Hướng dẫn nhanh - Google Sheets Data Collector

## Bắt đầu trong 5 phút

### Bước 1: Tạo Google Sheets (1 phút)
1. Vào [sheets.google.com](https://sheets.google.com)
2. Tạo bảng tính mới
3. Đặt tên: "Internet Data Collector"

### Bước 2: Cài đặt Apps Script (2 phút)
1. Trong Google Sheets: **Extensions** → **Apps Script**
2. Xóa code mặc định
3. Copy toàn bộ nội dung từ file `google-sheets-data-collector.gs`
4. Paste vào Apps Script Editor
5. **Ctrl+S** để lưu

### Bước 3: Chạy thiết lập (2 phút)
1. Chọn function `completeSetup` từ dropdown
2. Click **Run**
3. Cấp quyền khi được yêu cầu
4. Đợi hoàn thành (có thể mất 1-2 phút)

## ✅ Xong! Bảng tính đã sẵn sàng

Sau khi chạy `completeSetup()`, bạn sẽ có:
- ✅ Sheet "Data Collection" với dữ liệu mẫu
- ✅ Sheet "URLs" với danh sách websites
- ✅ Sheet "Data Report" với thống kê
- ✅ Trigger tự động chạy mỗi giờ

## 🎯 Sử dụng ngay

### Thu thập dữ liệu thủ công
```javascript
// Chạy các function này trong Apps Script Editor:

// Thu thập tin tức Việt Nam
collectVietnameseNews();

// Thu thập RSS feeds
collectRSSFeeds();

// Thu thập dữ liệu e-commerce
collectEcommerceData();
```

### Thêm URLs mới
1. Vào sheet "URLs"
2. Thêm URL mới vào cột A
3. Dữ liệu sẽ được thu thập tự động mỗi giờ

### Xem báo cáo
1. Vào sheet "Data Report"
2. Hoặc chạy `generateDataReport()` để cập nhật

## 🔧 Tùy chỉnh nhanh

### Thay đổi tần suất thu thập
```javascript
// Thay đổi từ mỗi giờ thành mỗi 30 phút
ScriptApp.newTrigger('automaticDataCollection')
  .timeBased()
  .everyMinutes(30)
  .create();
```

### Thêm websites mới
```javascript
// Thêm vào sheet "URLs" hoặc chạy trực tiếp:
collectDataFromURL('https://website-moi.com');
```

### Backup dữ liệu
```javascript
backupDataToDrive(); // Tạo backup trong Google Drive
```

## ⚠️ Lưu ý quan trọng

1. **Không spam**: Có delay 1-3 giây giữa các requests
2. **Tuân thủ robots.txt**: Tôn trọng quy định của websites
3. **Monitor logs**: Kiểm tra **View** → **Logs** nếu có lỗi
4. **API limits**: Google Apps Script có giới hạn 6 phút/function

## 🆘 Gặp lỗi?

### Lỗi phổ biến và cách fix nhanh:

**"Authorization required"**
→ Chạy lại function và cấp quyền

**"Timeout"**
→ Giảm số URLs hoặc tăng delay

**"Rate limited"**
→ Tăng `CONFIG.DELAY_BETWEEN_REQUESTS` lên 2000-3000ms

**"Parse error"**
→ Website có thể đã thay đổi cấu trúc HTML

## 📞 Cần hỗ trợ?

1. Kiểm tra logs: **View** → **Logs** trong Apps Script
2. Đọc file `README.md` để biết chi tiết
3. Xem file `demo-usage-examples.js` để có thêm ví dụ

---

**Chúc bạn thu thập dữ liệu thành công! 🎉**