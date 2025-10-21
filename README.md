# Google Sheets Internet Data Collector

Một hệ thống thu thập dữ liệu từ internet tự động sử dụng Google Sheets và Google Apps Script.

## 🚀 Tính năng chính

- ✅ Thu thập dữ liệu từ các website
- ✅ Thu thập dữ liệu từ API REST
- ✅ Thu thập RSS feeds
- ✅ Tự động hóa thu thập theo lịch
- ✅ Phân tích và báo cáo dữ liệu
- ✅ Backup tự động
- ✅ Monitor và cảnh báo
- ✅ Export dữ liệu ra CSV

## 📋 Yêu cầu

- Tài khoản Google (Gmail)
- Truy cập Google Sheets và Google Apps Script
- Kết nối internet

## 🛠️ Cài đặt nhanh

### Bước 1: Tạo Google Sheets
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo bảng tính mới
3. Đặt tên: "Internet Data Collector"

### Bước 2: Thiết lập Apps Script
1. Trong Google Sheets: **Extensions** > **Apps Script**
2. Copy nội dung từ `google-sheets-data-collector.gs`
3. Paste vào Apps Script Editor
4. Lưu project

### Bước 3: Chạy thiết lập tự động
```javascript
completeSetup(); // Chạy function này để thiết lập hoàn chỉnh
```

## 📊 Cấu trúc dữ liệu

| Cột | Mô tả | Ví dụ |
|-----|-------|-------|
| Timestamp | Thời gian thu thập | 2025-10-21 10:30:00 |
| URL | Đường dẫn nguồn | https://example.com |
| Title | Tiêu đề trang | "Tin tức mới nhất" |
| Description | Mô tả meta | "Cập nhật tin tức..." |
| Status Code | Mã HTTP | 200, 404, 500 |
| Content Length | Độ dài nội dung | 15420 |
| Keywords | Từ khóa | "tin tức, việt nam" |
| Author | Tác giả | "Nguyễn Văn A" |
| Published Date | Ngày xuất bản | 2025-10-21 |
| Image URL | Hình ảnh chính | https://example.com/img.jpg |
| Data Source | Nguồn dữ liệu | HTML Parser, API, RSS |
| Custom Data 1-3 | Dữ liệu tùy chỉnh | JSON, tags, notes |
| Notes | Ghi chú | "Test data" |

## 🔧 Sử dụng cơ bản

### Thu thập từ một URL
```javascript
collectDataFromURL('https://vnexpress.net');
```

### Thu thập từ nhiều URLs
```javascript
const urls = [
  'https://vnexpress.net',
  'https://dantri.com.vn',
  'https://tuoitre.vn'
];
collectDataFromMultipleURLs(urls);
```

### Thu thập từ API
```javascript
collectDataFromAPI('https://api.example.com/data', 'your-api-key');
```

### Thu thập RSS Feed
```javascript
collectRSSFeed('https://vnexpress.net/rss/tin-moi-nhat.rss');
```

## ⚙️ Tự động hóa

### Thiết lập thu thập tự động
```javascript
setupAutomaticCollection(); // Mỗi giờ
```

### Thiết lập lịch tùy chỉnh
```javascript
// Hàng ngày lúc 8:00 AM
ScriptApp.newTrigger('collectVietnameseNews')
  .timeBased()
  .everyDays(1)
  .atHour(8)
  .create();
```

## 📈 Phân tích dữ liệu

### Tạo báo cáo
```javascript
generateDataReport(); // Tạo sheet "Data Report"
```

### Monitor hệ thống
```javascript
monitorDataCollection(); // Kiểm tra và gửi cảnh báo
```

## 💾 Backup & Export

### Backup dữ liệu
```javascript
backupDataToDrive(); // Tạo backup trong Google Drive
```

### Export CSV
```javascript
exportToCSV(); // Xuất dữ liệu ra file CSV
```

## 📝 Ví dụ sử dụng

### 1. Thu thập tin tức Việt Nam
```javascript
function collectVietnameseNews() {
  const newsUrls = [
    'https://vnexpress.net',
    'https://dantri.com.vn',
    'https://tuoitre.vn'
  ];
  
  collectDataFromMultipleURLs(newsUrls);
}
```

### 2. Thu thập dữ liệu e-commerce
```javascript
function collectEcommerceData() {
  const sites = [
    'https://tiki.vn',
    'https://shopee.vn',
    'https://lazada.vn'
  ];
  
  sites.forEach(url => {
    collectDataFromURL(url, {
      customData1: 'E-commerce',
      customData2: 'Product Research'
    });
  });
}
```

### 3. Thu thập API cryptocurrency
```javascript
function collectCryptoData() {
  const cryptoAPI = 'https://api.coindesk.com/v1/bpi/currentprice.json';
  collectDataFromAPI(cryptoAPI);
}
```

## ⚠️ Lưu ý quan trọng

### Giới hạn và Best Practices
- **Rate Limiting**: Delay 1-3 giây giữa các requests
- **Timeout**: 30 giây cho mỗi request
- **Robots.txt**: Tuân thủ quy định của website
- **API Keys**: Bảo mật thông tin API keys
- **Data Privacy**: Không thu thập thông tin cá nhân

### Xử lý lỗi
- Tự động retry khi lỗi network
- Log chi tiết trong Apps Script
- Lưu lỗi vào sheet để theo dõi

### Performance
- Batch processing cho nhiều URLs
- Parallel requests (cẩn thận với rate limits)
- Cleanup dữ liệu cũ định kỳ

## 🔍 Troubleshooting

### Lỗi phổ biến

**1. Authorization Required**
```
Giải pháp: Chạy lại function và cấp quyền truy cập
```

**2. Timeout Error**
```
Giải pháp: Tăng timeout trong CONFIG hoặc giảm số URLs
```

**3. Rate Limited**
```
Giải pháp: Tăng delay giữa requests (CONFIG.DELAY_BETWEEN_REQUESTS)
```

**4. Parse Error**
```
Giải pháp: Kiểm tra format HTML/JSON của nguồn dữ liệu
```

### Debug
```javascript
// Xem logs
Logger.log('Debug message');

// Trong Apps Script Editor: View > Logs
```

## 📚 API Reference

### Core Functions

#### `initializeSheet()`
Khởi tạo sheet với headers và formatting

#### `collectDataFromURL(url, customData)`
Thu thập dữ liệu từ một URL
- `url`: String - URL cần thu thập
- `customData`: Object - Dữ liệu tùy chỉnh

#### `collectDataFromMultipleURLs(urls)`
Thu thập từ nhiều URLs
- `urls`: Array - Mảng các URLs

#### `collectDataFromAPI(apiUrl, apiKey, headers)`
Thu thập từ REST API
- `apiUrl`: String - Endpoint API
- `apiKey`: String - API key (optional)
- `headers`: Object - Custom headers (optional)

#### `collectRSSFeed(rssUrl)`
Thu thập RSS feed
- `rssUrl`: String - URL của RSS feed

#### `setupAutomaticCollection()`
Thiết lập trigger tự động mỗi giờ

#### `generateDataReport()`
Tạo báo cáo phân tích dữ liệu

#### `backupDataToDrive()`
Backup dữ liệu vào Google Drive

#### `exportToCSV()`
Export dữ liệu ra file CSV

### Configuration

```javascript
const CONFIG = {
  SHEET_NAME: 'Data Collection',
  API_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  DELAY_BETWEEN_REQUESTS: 1000
};
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - Sử dụng tự do cho mọi mục đích.

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra [Troubleshooting](#-troubleshooting)
2. Xem logs trong Apps Script Editor
3. Tạo issue với thông tin chi tiết

---

**Tạo bởi**: AI Assistant  
**Cập nhật**: 2025-10-21  
**Version**: 1.0.0