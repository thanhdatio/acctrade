/**
 * Google Apps Script để thu thập dữ liệu từ internet
 * Tác giả: AI Assistant
 * Ngày tạo: 2025-10-21
 */

// Cấu hình chung
const CONFIG = {
  SHEET_NAME: 'Data Collection',
  API_TIMEOUT: 30000, // 30 giây
  MAX_RETRIES: 3,
  DELAY_BETWEEN_REQUESTS: 1000 // 1 giây
};

/**
 * Hàm khởi tạo bảng tính và thiết lập headers
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  
  // Thiết lập headers
  const headers = [
    'Timestamp',
    'URL',
    'Title', 
    'Description',
    'Status Code',
    'Content Length',
    'Keywords',
    'Author',
    'Published Date',
    'Image URL',
    'Data Source',
    'Custom Data 1',
    'Custom Data 2',
    'Custom Data 3',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  
  // Định dạng cột
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 300); // URL
  sheet.setColumnWidth(3, 250); // Title
  sheet.setColumnWidth(4, 300); // Description
  
  Logger.log('Đã khởi tạo sheet thành công');
}

/**
 * Thu thập dữ liệu từ một URL cụ thể
 */
function collectDataFromURL(url, customData = {}) {
  try {
    Logger.log(`Bắt đầu thu thập dữ liệu từ: ${url}`);
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      muteHttpExceptions: true
    });
    
    const html = response.getContentText();
    const statusCode = response.getResponseCode();
    
    // Phân tích HTML để lấy thông tin
    const data = parseHTMLContent(html, url);
    data.statusCode = statusCode;
    data.contentLength = html.length;
    data.url = url;
    data.timestamp = new Date();
    
    // Thêm custom data
    Object.assign(data, customData);
    
    // Lưu vào sheet
    saveDataToSheet(data);
    
    Logger.log(`Đã thu thập thành công dữ liệu từ: ${url}`);
    return data;
    
  } catch (error) {
    Logger.log(`Lỗi khi thu thập dữ liệu từ ${url}: ${error.toString()}`);
    
    // Lưu lỗi vào sheet
    const errorData = {
      timestamp: new Date(),
      url: url,
      title: 'ERROR',
      description: error.toString(),
      statusCode: 'ERROR',
      contentLength: 0,
      dataSource: 'Error Log'
    };
    
    saveDataToSheet(errorData);
    return null;
  }
}

/**
 * Phân tích nội dung HTML
 */
function parseHTMLContent(html, url) {
  const data = {};
  
  try {
    // Lấy title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    data.title = titleMatch ? titleMatch[1].trim() : 'No title found';
    
    // Lấy meta description
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    data.description = descMatch ? descMatch[1].trim() : 'No description found';
    
    // Lấy meta keywords
    const keywordsMatch = html.match(/<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    data.keywords = keywordsMatch ? keywordsMatch[1].trim() : '';
    
    // Lấy author
    const authorMatch = html.match(/<meta[^>]*name=["\']author["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    data.author = authorMatch ? authorMatch[1].trim() : '';
    
    // Lấy published date
    const dateMatch = html.match(/<meta[^>]*property=["\']article:published_time["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    data.publishedDate = dateMatch ? dateMatch[1].trim() : '';
    
    // Lấy image URL
    const imageMatch = html.match(/<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    data.imageUrl = imageMatch ? imageMatch[1].trim() : '';
    
    data.dataSource = 'HTML Parser';
    
  } catch (error) {
    Logger.log(`Lỗi khi phân tích HTML: ${error.toString()}`);
    data.title = 'Parse Error';
    data.description = error.toString();
  }
  
  return data;
}

/**
 * Lưu dữ liệu vào sheet
 */
function saveDataToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    initializeSheet();
    sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  }
  
  const row = [
    data.timestamp || new Date(),
    data.url || '',
    data.title || '',
    data.description || '',
    data.statusCode || '',
    data.contentLength || 0,
    data.keywords || '',
    data.author || '',
    data.publishedDate || '',
    data.imageUrl || '',
    data.dataSource || '',
    data.customData1 || '',
    data.customData2 || '',
    data.customData3 || '',
    data.notes || ''
  ];
  
  sheet.appendRow(row);
}

/**
 * Thu thập dữ liệu từ nhiều URL
 */
function collectDataFromMultipleURLs(urls) {
  if (!Array.isArray(urls)) {
    throw new Error('URLs phải là một mảng');
  }
  
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    Logger.log(`Đang xử lý URL ${i + 1}/${urls.length}: ${url}`);
    
    const result = collectDataFromURL(url);
    results.push(result);
    
    // Delay giữa các requests để tránh bị chặn
    if (i < urls.length - 1) {
      Utilities.sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
    }
  }
  
  return results;
}

/**
 * Thu thập dữ liệu từ API JSON
 */
function collectDataFromAPI(apiUrl, apiKey = null, customHeaders = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Google Apps Script Data Collector',
      ...customHeaders
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    const response = UrlFetchApp.fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      muteHttpExceptions: true
    });
    
    const jsonData = JSON.parse(response.getContentText());
    const statusCode = response.getResponseCode();
    
    if (statusCode === 200) {
      // Xử lý dữ liệu JSON và lưu vào sheet
      const processedData = processAPIResponse(jsonData, apiUrl);
      saveDataToSheet(processedData);
      
      Logger.log(`Đã thu thập thành công dữ liệu từ API: ${apiUrl}`);
      return processedData;
    } else {
      throw new Error(`API trả về status code: ${statusCode}`);
    }
    
  } catch (error) {
    Logger.log(`Lỗi khi thu thập dữ liệu từ API ${apiUrl}: ${error.toString()}`);
    return null;
  }
}

/**
 * Xử lý response từ API
 */
function processAPIResponse(jsonData, apiUrl) {
  const data = {
    timestamp: new Date(),
    url: apiUrl,
    dataSource: 'API Response',
    statusCode: 200
  };
  
  // Xử lý dữ liệu JSON tùy theo cấu trúc
  if (jsonData.title) data.title = jsonData.title;
  if (jsonData.description) data.description = jsonData.description;
  if (jsonData.name) data.title = jsonData.name;
  if (jsonData.summary) data.description = jsonData.summary;
  
  // Chuyển đổi object thành string để lưu trữ
  data.customData1 = JSON.stringify(jsonData);
  
  return data;
}

/**
 * Thiết lập trigger tự động thu thập dữ liệu
 */
function setupAutomaticCollection() {
  // Xóa các trigger cũ
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'automaticDataCollection') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Tạo trigger mới - chạy mỗi giờ
  ScriptApp.newTrigger('automaticDataCollection')
    .timeBased()
    .everyHours(1)
    .create();
    
  Logger.log('Đã thiết lập trigger tự động thu thập dữ liệu mỗi giờ');
}

/**
 * Hàm được gọi tự động theo lịch
 */
function automaticDataCollection() {
  // Lấy danh sách URL từ sheet "URLs" nếu có
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const urlSheet = ss.getSheetByName('URLs');
  
  if (urlSheet) {
    const urlRange = urlSheet.getDataRange();
    const urlValues = urlRange.getValues();
    
    // Bỏ qua header row
    for (let i = 1; i < urlValues.length; i++) {
      const url = urlValues[i][0];
      if (url && url.startsWith('http')) {
        collectDataFromURL(url);
        Utilities.sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
      }
    }
  }
}

/**
 * Thu thập dữ liệu RSS Feed
 */
function collectRSSFeed(rssUrl) {
  try {
    const response = UrlFetchApp.fetch(rssUrl);
    const xml = response.getContentText();
    
    // Parse XML đơn giản để lấy items
    const items = parseRSSXML(xml);
    
    items.forEach(item => {
      const data = {
        timestamp: new Date(),
        url: item.link || rssUrl,
        title: item.title || '',
        description: item.description || '',
        publishedDate: item.pubDate || '',
        dataSource: 'RSS Feed',
        customData1: rssUrl
      };
      
      saveDataToSheet(data);
    });
    
    Logger.log(`Đã thu thập ${items.length} items từ RSS feed: ${rssUrl}`);
    return items;
    
  } catch (error) {
    Logger.log(`Lỗi khi thu thập RSS feed ${rssUrl}: ${error.toString()}`);
    return [];
  }
}

/**
 * Parse XML RSS đơn giản
 */
function parseRSSXML(xml) {
  const items = [];
  
  try {
    // Tìm tất cả các item trong RSS
    const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi);
    
    if (itemMatches) {
      itemMatches.forEach(itemXml => {
        const item = {};
        
        // Lấy title
        const titleMatch = itemXml.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) item.title = titleMatch[1].trim();
        
        // Lấy link
        const linkMatch = itemXml.match(/<link[^>]*>([^<]+)<\/link>/i);
        if (linkMatch) item.link = linkMatch[1].trim();
        
        // Lấy description
        const descMatch = itemXml.match(/<description[^>]*>([^<]+)<\/description>/i);
        if (descMatch) item.description = descMatch[1].trim();
        
        // Lấy pubDate
        const dateMatch = itemXml.match(/<pubDate[^>]*>([^<]+)<\/pubDate>/i);
        if (dateMatch) item.pubDate = dateMatch[1].trim();
        
        items.push(item);
      });
    }
  } catch (error) {
    Logger.log(`Lỗi khi parse RSS XML: ${error.toString()}`);
  }
  
  return items;
}

/**
 * Hàm test để kiểm tra chức năng
 */
function testDataCollection() {
  // Test URLs
  const testUrls = [
    'https://vnexpress.net',
    'https://dantri.com.vn',
    'https://tuoitre.vn'
  ];
  
  Logger.log('Bắt đầu test thu thập dữ liệu...');
  
  // Khởi tạo sheet
  initializeSheet();
  
  // Test thu thập từ URLs
  testUrls.forEach(url => {
    collectDataFromURL(url, {
      customData1: 'Test Data',
      notes: 'Dữ liệu test'
    });
  });
  
  Logger.log('Hoàn thành test thu thập dữ liệu');
}

/**
 * Xóa tất cả dữ liệu trong sheet
 */
function clearAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    Logger.log('Đã xóa tất cả dữ liệu');
  }
}

/**
 * Xuất dữ liệu ra CSV
 */
function exportToCSV() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (sheet) {
    const data = sheet.getDataRange().getValues();
    let csv = '';
    
    data.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // Tạo file CSV trong Drive
    const blob = Utilities.newBlob(csv, 'text/csv', 'data_collection_export.csv');
    const file = DriveApp.createFile(blob);
    
    Logger.log(`Đã xuất dữ liệu ra file CSV: ${file.getUrl()}`);
    return file.getUrl();
  }
}