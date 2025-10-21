/**
 * Các ví dụ sử dụng Google Sheets Data Collector
 * Copy các function này vào Apps Script để sử dụng
 */

/**
 * VÍ DỤ 1: Thu thập tin tức từ các trang báo Việt Nam
 */
function collectVietnameseNews() {
  Logger.log('Bắt đầu thu thập tin tức Việt Nam...');
  
  const newsUrls = [
    'https://vnexpress.net',
    'https://dantri.com.vn', 
    'https://tuoitre.vn',
    'https://thanhnien.vn',
    'https://vietnamnet.vn'
  ];
  
  newsUrls.forEach((url, index) => {
    Logger.log(`Thu thập từ ${url} (${index + 1}/${newsUrls.length})`);
    
    collectDataFromURL(url, {
      customData1: 'Vietnamese News',
      customData2: 'Daily Collection',
      notes: `Tin tức từ ${url}`
    });
    
    // Delay 2 giây giữa các requests
    Utilities.sleep(2000);
  });
  
  Logger.log('Hoàn thành thu thập tin tức Việt Nam');
}

/**
 * VÍ DỤ 2: Thu thập dữ liệu từ API công khai
 */
function collectPublicAPIData() {
  Logger.log('Thu thập dữ liệu từ các API công khai...');
  
  // API thời tiết
  const weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=Hanoi&appid=YOUR_API_KEY';
  
  // API tin tức
  const newsAPI = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY';
  
  // API cryptocurrency
  const cryptoAPI = 'https://api.coindesk.com/v1/bpi/currentprice.json';
  
  // Thu thập từ crypto API (không cần API key)
  try {
    const cryptoData = collectDataFromAPI(cryptoAPI);
    Logger.log('Đã thu thập dữ liệu cryptocurrency');
  } catch (error) {
    Logger.log(`Lỗi thu thập crypto data: ${error}`);
  }
  
  // Để sử dụng weather và news API, cần đăng ký API key
  Logger.log('Hoàn thành thu thập API data');
}

/**
 * VÍ DỤ 3: Thu thập RSS feeds
 */
function collectRSSFeeds() {
  Logger.log('Thu thập RSS feeds...');
  
  const rssFeeds = [
    'https://vnexpress.net/rss/tin-moi-nhat.rss',
    'https://dantri.com.vn/rss.htm',
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://rss.cnn.com/rss/edition.rss'
  ];
  
  rssFeeds.forEach(rssUrl => {
    Logger.log(`Thu thập RSS: ${rssUrl}`);
    collectRSSFeed(rssUrl);
    Utilities.sleep(1000);
  });
  
  Logger.log('Hoàn thành thu thập RSS feeds');
}

/**
 * VÍ DỤ 4: Thu thập thông tin sản phẩm e-commerce
 */
function collectEcommerceData() {
  Logger.log('Thu thập dữ liệu e-commerce...');
  
  const ecommerceUrls = [
    'https://tiki.vn',
    'https://shopee.vn',
    'https://lazada.vn',
    'https://sendo.vn'
  ];
  
  ecommerceUrls.forEach(url => {
    collectDataFromURL(url, {
      customData1: 'E-commerce',
      customData2: 'Product Research',
      customData3: new Date().toISOString().split('T')[0], // Current date
      notes: `Dữ liệu từ ${url.replace('https://', '')}`
    });
    
    Utilities.sleep(3000); // 3 giây delay cho e-commerce sites
  });
  
  Logger.log('Hoàn thành thu thập e-commerce data');
}

/**
 * VÍ DỤ 5: Thu thập dữ liệu định kỳ với custom schedule
 */
function setupCustomSchedule() {
  // Xóa tất cả triggers cũ
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Trigger hàng ngày lúc 8:00 AM
  ScriptApp.newTrigger('collectVietnameseNews')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  
  // Trigger mỗi 4 tiếng cho RSS
  ScriptApp.newTrigger('collectRSSFeeds')
    .timeBased()
    .everyHours(4)
    .create();
  
  // Trigger hàng tuần cho e-commerce (Chủ nhật 10:00 AM)
  ScriptApp.newTrigger('collectEcommerceData')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(10)
    .create();
  
  Logger.log('Đã thiết lập custom schedule triggers');
}

/**
 * VÍ DỤ 6: Phân tích và báo cáo dữ liệu
 */
function generateDataReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('Data Collection');
  
  if (!dataSheet) {
    Logger.log('Không tìm thấy sheet dữ liệu');
    return;
  }
  
  // Tạo sheet báo cáo
  let reportSheet = ss.getSheetByName('Data Report');
  if (!reportSheet) {
    reportSheet = ss.insertSheet('Data Report');
  } else {
    reportSheet.clear();
  }
  
  // Headers cho báo cáo
  const reportHeaders = [
    'Metric',
    'Value',
    'Description'
  ];
  
  reportSheet.getRange(1, 1, 1, reportHeaders.length).setValues([reportHeaders]);
  reportSheet.getRange(1, 1, 1, reportHeaders.length).setFontWeight('bold');
  
  // Lấy dữ liệu
  const data = dataSheet.getDataRange().getValues();
  const totalRows = data.length - 1; // Trừ header
  
  if (totalRows <= 0) {
    reportSheet.getRange(2, 1, 1, 3).setValues([['No Data', '0', 'Chưa có dữ liệu nào được thu thập']]);
    return;
  }
  
  // Thống kê cơ bản
  const stats = [];
  
  // Tổng số records
  stats.push(['Total Records', totalRows, 'Tổng số bản ghi đã thu thập']);
  
  // Đếm theo data source
  const sources = {};
  const domains = {};
  const errorCount = data.filter(row => row[4] === 'ERROR').length - 1;
  
  for (let i = 1; i < data.length; i++) {
    const source = data[i][10] || 'Unknown'; // Data Source column
    const url = data[i][1] || '';
    
    sources[source] = (sources[source] || 0) + 1;
    
    if (url) {
      try {
        const domain = new URL(url).hostname;
        domains[domain] = (domains[domain] || 0) + 1;
      } catch (e) {
        // Invalid URL
      }
    }
  }
  
  stats.push(['Error Records', errorCount, 'Số bản ghi lỗi']);
  stats.push(['Success Rate', `${((totalRows - errorCount) / totalRows * 100).toFixed(2)}%`, 'Tỷ lệ thành công']);
  
  // Top domains
  const sortedDomains = Object.entries(domains).sort((a, b) => b[1] - a[1]);
  stats.push(['Top Domain', sortedDomains[0] ? `${sortedDomains[0][0]} (${sortedDomains[0][1]} records)` : 'N/A', 'Domain có nhiều dữ liệu nhất']);
  
  // Data sources
  Object.entries(sources).forEach(([source, count]) => {
    stats.push([`Source: ${source}`, count, `Số records từ ${source}`]);
  });
  
  // Ghi báo cáo
  reportSheet.getRange(2, 1, stats.length, 3).setValues(stats);
  
  // Định dạng
  reportSheet.setColumnWidth(1, 200);
  reportSheet.setColumnWidth(2, 100);
  reportSheet.setColumnWidth(3, 300);
  
  Logger.log('Đã tạo báo cáo dữ liệu');
}

/**
 * VÍ DỤ 7: Backup và restore dữ liệu
 */
function backupDataToDrive() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('Data Collection');
  
  if (!dataSheet) {
    Logger.log('Không tìm thấy sheet dữ liệu để backup');
    return;
  }
  
  // Tạo backup folder
  const folders = DriveApp.getFoldersByName('Data Collection Backups');
  let backupFolder;
  
  if (folders.hasNext()) {
    backupFolder = folders.next();
  } else {
    backupFolder = DriveApp.createFolder('Data Collection Backups');
  }
  
  // Tạo file backup
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm-ss');
  const backupName = `data_backup_${timestamp}`;
  
  // Copy sheet sang file mới
  const newSS = SpreadsheetApp.create(backupName);
  const newSheet = newSS.getActiveSheet();
  
  // Copy dữ liệu
  const data = dataSheet.getDataRange().getValues();
  if (data.length > 0) {
    newSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
  
  // Di chuyển file vào backup folder
  const file = DriveApp.getFileById(newSS.getId());
  backupFolder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  
  Logger.log(`Đã backup dữ liệu: ${file.getUrl()}`);
  return file.getUrl();
}

/**
 * VÍ DỤ 8: Monitor và alert
 */
function monitorDataCollection() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('Data Collection');
  
  if (!dataSheet) {
    Logger.log('Không tìm thấy sheet dữ liệu');
    return;
  }
  
  const data = dataSheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    sendAlert('Cảnh báo: Không có dữ liệu nào được thu thập!');
    return;
  }
  
  // Kiểm tra dữ liệu trong 24h qua
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let recentRecords = 0;
  let errorRecords = 0;
  
  for (let i = 1; i < data.length; i++) {
    const timestamp = new Date(data[i][0]);
    if (timestamp > last24Hours) {
      recentRecords++;
      if (data[i][4] === 'ERROR') {
        errorRecords++;
      }
    }
  }
  
  // Alert nếu không có dữ liệu mới
  if (recentRecords === 0) {
    sendAlert('Cảnh báo: Không có dữ liệu mới trong 24h qua!');
  }
  
  // Alert nếu tỷ lệ lỗi cao
  if (recentRecords > 0 && (errorRecords / recentRecords) > 0.5) {
    sendAlert(`Cảnh báo: Tỷ lệ lỗi cao! ${errorRecords}/${recentRecords} records bị lỗi trong 24h qua.`);
  }
  
  Logger.log(`Monitor: ${recentRecords} records mới, ${errorRecords} lỗi trong 24h qua`);
}

/**
 * Gửi alert email
 */
function sendAlert(message) {
  const email = Session.getActiveUser().getEmail();
  
  MailApp.sendEmail({
    to: email,
    subject: 'Data Collection Alert',
    body: message
  });
  
  Logger.log(`Đã gửi alert: ${message}`);
}

/**
 * VÍ DỤ 9: Setup hoàn chỉnh cho người dùng mới
 */
function completeSetup() {
  Logger.log('Bắt đầu thiết lập hoàn chỉnh...');
  
  // 1. Khởi tạo sheet chính
  initializeSheet();
  
  // 2. Tạo sheet URLs
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let urlSheet = ss.getSheetByName('URLs');
  if (!urlSheet) {
    urlSheet = ss.insertSheet('URLs');
    urlSheet.getRange(1, 1, 1, 1).setValue('URL');
    urlSheet.getRange(1, 1, 1, 1).setFontWeight('bold');
    
    // Thêm một số URLs mẫu
    const sampleUrls = [
      'https://vnexpress.net',
      'https://dantri.com.vn',
      'https://tuoitre.vn'
    ];
    
    for (let i = 0; i < sampleUrls.length; i++) {
      urlSheet.getRange(i + 2, 1, 1, 1).setValue(sampleUrls[i]);
    }
  }
  
  // 3. Chạy test
  testDataCollection();
  
  // 4. Thiết lập trigger tự động
  setupAutomaticCollection();
  
  // 5. Tạo báo cáo đầu tiên
  Utilities.sleep(2000); // Đợi data được ghi
  generateDataReport();
  
  Logger.log('Hoàn thành thiết lập! Bảng tính đã sẵn sàng sử dụng.');
}