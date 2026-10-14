// =============================================================
// app.js — WKE 教務系統
// 負責：側邊欄選單、漢堡按鈕、深色模式、儀表板卡片
// 資料路徑為相對路徑，會依 index.html 的 <base href> 自動組合
// =============================================================

document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();
  initThemeToggle();
  loadSidebar();
  loadDashboardCards();
});

// 建立元素的小工具：用 textContent 填字，不使用 innerHTML，避免 JSON 內容被當成 HTML 執行
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---------- 1. 手機版漢堡選單（原本缺少這段，所以按鈕沒有作用） ----------
function initMenuToggle() {
  const menuBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

function closeSidebarOnMobile() {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-toggle");
  if (!sidebar) return;
  sidebar.classList.remove("open");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
}

// ---------- 2. 深色模式（記住使用者選擇） ----------
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const render = () => {
    const isDark = document.body.classList.contains("dark-theme");
    btn.textContent = isDark ? "☀️ 切換淺色" : "🌙 切換深色";
  };

  try {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-theme");
    }
  } catch (e) {
    // 瀏覽器禁用儲存時就略過，不影響功能
  }
  render();

  btn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
    render();
  });
}

// ---------- 3. 讀取 teacher_ops.json，產生 Sidebar ----------
async function loadSidebar() {
  const list = document.getElementById("sidebar-items");
  if (!list) return;

  try {
    const response = await fetch("json/teacher_ops.json");
    if (!response.ok) throw new Error(`teacher_ops.json 讀取失敗 (${response.status})`);

    const items = await response.json();
    list.replaceChildren();

    items.forEach((item) => {
      const li = el("li", item.active ? "nav-item active" : "nav-item");
      li.append(el("span", "nav-icon", item.icon ?? ""), el("span", "nav-text", item.title ?? ""));

      li.addEventListener("click", () => {
        list.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
        li.classList.add("active");
        closeSidebarOnMobile();
      });

      list.appendChild(li);
    });
  } catch (error) {
    console.error("載入側邊欄錯誤:", error);
    list.replaceChildren(el("li", "nav-item", "無法載入選單"));
  }
}

// ---------- 4. 讀取 dashboard_cards.json，產生 Main 卡片 ----------
async function loadDashboardCards() {
  const container = document.getElementById("card-container");
  if (!container) return;

  try {
    const response = await fetch("json/dashboard_cards.json");
    if (!response.ok) throw new Error(`dashboard_cards.json 讀取失敗 (${response.status})`);

    const cards = await response.json();
    container.replaceChildren();

    cards.forEach((card) => {
      const article = el("article", "card");

      const header = el("div", "card-header");
      header.append(el("h3", "", card.title ?? ""), el("span", "card-tag", card.tag ?? ""));

      article.append(
        header,
        el("div", "card-value", String(card.value ?? "")),
        el("p", "", card.description ?? "")
      );
      container.appendChild(article);
    });
  } catch (error) {
    console.error("載入儀表板卡片錯誤:", error);
    container.replaceChildren(el("p", "", "無法載入卡片資料"));
  }
}