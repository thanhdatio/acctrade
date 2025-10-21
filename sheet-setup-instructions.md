# Hướng dẫn thiết lập Google Sheets thu thập dữ liệu từ Internet

## Bước 1: Tạo Google Sheets mới

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo một bảng tính mới
3. Đặt tên cho bảng tính: "Internet Data Collector"

## Bước 2: Thiết lập Google Apps Script

1. Trong Google Sheets, vào menu **Extensions** > **Apps Script**
2. Xóa code mặc định trong file `Code.gs`
3. Copy toàn bộ nội dung từ file `google-sheets-data-collector.gs` và paste vào
4. Lưu project (Ctrl+S)
5. Đặt tên project: "Internet Data Collector"

## Bước 3: Cấp quyền truy cập

1. Chạy function `initializeSheet()` lần đầu tiên:
   - Chọn function `initializeSheet` từ dropdown
   - Click nút **Run**
   - Cấp các quyền cần thiết khi được yêu cầu

## Bước 4: Thiết lập sheet URLs (tùy chọn)

1. Tạo sheet mới tên "URLs"
2. Trong cột A, nhập danh sách các URL muốn thu thập dữ liệu:
   ```
   URL
   https://vnexpress.net
   https://dantri.com.vn
   https://tuoitre.vn
   https://example.com/api/data
   ```

## Bước 5: Các chức năng chính

### Thu thập dữ liệu từ một URL
```javascript
collectDataFromURL('https://example.com');
```

### Thu thập dữ liệu từ nhiều URLs
```javascript
const urls = ['https://site1.com', 'https://site2.com'];
collectDataFromMultipleURLs(urls);
```

### Thu thập dữ liệu từ API
```javascript
collectDataFromAPI('https://api.example.com/data', 'your-api-key');
```

### Thu thập RSS Feed
```javascript
collectRSSFeed('https://example.com/rss.xml');
```

### Thiết lập thu thập tự động
```javascript
setupAutomaticCollection(); // Chạy mỗi giờ
```

### Test chức năng
```javascript
testDataCollection(); // Chạy test với các URL mẫu
```

## Bước 6: Cấu trúc dữ liệu thu thập

Bảng tính sẽ có các cột sau:

| Cột | Mô tả |
|-----|-------|
| Timestamp | Thời gian thu thập |
| URL | Đường dẫn nguồn |
| Title | Tiêu đề trang/bài viết |
| Description | Mô tả meta |
| Status Code | Mã trạng thái HTTP |
| Content Length | Độ dài nội dung |
| Keywords | Từ khóa meta |
| Author | Tác giả |
| Published Date | Ngày xuất bản |
| Image URL | URL hình ảnh chính |
| Data Source | Nguồn dữ liệu |
| Custom Data 1-3 | Dữ liệu tùy chỉnh |
| Notes | Ghi chú |

## Bước 7: Sử dụng nâng cao

### Trigger tự động
- Chạy `setupAutomaticCollection()` để thiết lập thu thập tự động mỗi giờ
- Dữ liệu sẽ được thu thập từ danh sách URLs trong sheet "URLs"

### Xuất dữ liệu
- Chạy `exportToCSV()` để xuất dữ liệu ra file CSV trong Google Drive

### Xóa dữ liệu
- Chạy `clearAllData()` để xóa tất cả dữ liệu đã thu thập

## Lưu ý quan trọng

1. **Giới hạn tần suất**: Có delay 1 giây giữa các request để tránh bị chặn
2. **Timeout**: Mỗi request có timeout 30 giây
3. **Quyền truy cập**: Cần cấp quyền truy cập UrlFetchApp và SpreadsheetApp
4. **Rate limiting**: Tuân thủ robots.txt và chính sách của các website
5. **Dữ liệu nhạy cảm**: Không thu thập thông tin cá nhân hoặc bảo mật

## Troubleshooting

### Lỗi thường gặp:
1. **Authorization required**: Chạy lại function và cấp quyền
2. **Timeout**: Tăng thời gian timeout trong CONFIG
3. **Rate limited**: Tăng delay giữa các requests
4. **Parse error**: Kiểm tra format HTML/JSON của nguồn dữ liệu

### Debug:
- Xem logs trong Apps Script Editor: **View** > **Logs**
- Sử dụng `Logger.log()` để debug