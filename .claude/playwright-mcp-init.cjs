// Playwright MCP initPage — nạp qua "browser.initPage" trong .claude/playwright-mcp-config.json.
// Tắt các popup của Chrome che màn hình khi debug / quay video user guide:
//   Save password? · "Change your password" (cảnh báo lộ mật khẩu) · Save address? · Save card?
// Chrome không có cờ dòng lệnh cho các popup này → mở chrome://settings một lần, đặt preference qua chrome.settingsPrivate.
// Profile MCP là profile lưu trên đĩa → giá trị giữ lại cho các lần mở sau.
// initPage chạy cho MỌI tab (kể cả tab chrome://settings mở ở đây) → cờ `started` chặn chạy lặp trong cùng tiến trình MCP.
const PREFS = {
  credentials_enable_service: false,                 // Save password?
  'profile.password_manager_leak_detection': false,  // Change your password (mật khẩu bị lộ)
  'autofill.profile_enabled': false,                 // Save address?
  'autofill.credit_card_enabled': false,             // Save card?
};

let started = false;

module.exports = {
  default: async ({ page }) => {
    if (started) return;
    started = true;
    const settings = await page.context().newPage();
    try {
      await settings.goto('chrome://settings/');
      await settings.evaluate((prefs) => Promise.all(Object.entries(prefs).map(([k, v]) =>
        new Promise((res) => chrome.settingsPrivate.setPref(k, v, '', () => res())))), PREFS);
    } catch {
      // Không phải Chrome/Chromium (firefox, webkit) hoặc không mở được chrome:// → bỏ qua, không chặn MCP khởi động
    } finally {
      await settings.close().catch(() => {});
    }
  },
};
