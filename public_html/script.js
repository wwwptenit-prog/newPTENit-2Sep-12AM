/**
 * ============================================================================
 * PTENit - Main Application Script (Pure Vanilla JS, 100% cPanel Ready)
 * ============================================================================
 */

// Global Configuration
const PTENIT_CONFIG = {
  appName: "PTENit",
  currency: "৳",
  defaultWhatsApp: "+8801XXXXXXXXX", // Replace with your WhatsApp number (e.g. +8801712345678)
  cartKey: "ptenit_cart",
  themeKey: "ptenit_theme"
};

// ==========================================
// 1. THEME MANAGER (Dark / Light Mode)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem(PTENIT_CONFIG.themeKey);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  updateThemeIcons();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem(PTENIT_CONFIG.themeKey, isDark ? "dark" : "light");
  updateThemeIcons();
  showToast(isDark ? "ডার্ক মোড সক্রিয় হয়েছে" : "লাইট মোড সক্রিয় হয়েছে", "info");
}

function updateThemeIcons() {
  const isDark = document.body.classList.contains("dark");
  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.innerHTML = isDark 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  });
}

// ==========================================
// 2. TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "✓";
  if (type === "error") icon = "✕";
  if (type === "info") icon = "ℹ";

  toast.innerHTML = `
    <span style="font-weight:900; font-size:1.1rem;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// 3. CART MANAGEMENT
// ==========================================
function getCart() {
  try {
    const raw = localStorage.getItem(PTENIT_CONFIG.cartKey);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(PTENIT_CONFIG.cartKey, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(item => String(item.id) === String(product.id));

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || "assets/images/service-web.svg",
      category: product.category || "General",
      qty: qty
    });
  }

  saveCart(cart);
  showToast(`"${product.name}" কার্টে যোগ করা হয়েছে!`, "success");
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => String(item.id) !== String(productId));
  saveCart(cart);
  showToast("পণ্যটি কার্ট থেকে সরানো হয়েছে", "info");
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(productId));
  if (item) {
    item.qty = Math.max(1, parseInt(qty) || 1);
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem(PTENIT_CONFIG.cartKey);
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// Format Currency
function formatPrice(amount) {
  return PTENIT_CONFIG.currency + " " + Number(amount || 0).toLocaleString("en-BD");
}

// ==========================================
// 4. WHATSAPP CHECKOUT & ORDER DISPATCH
// ==========================================
function getWhatsAppNumber() {
  return localStorage.getItem("ptenit_custom_wa") || PTENIT_CONFIG.defaultWhatsApp;
}

function createWhatsAppOrderMessage(cartItems, customer = {}) {
  const cleanNumber = getWhatsAppNumber().replace(/[^0-9]/g, "");
  let message = `*🛍️ NEW ORDER - PTENit Web Store*\n`;
  message += `--------------------------------\n`;
  if (customer.name) message += `👤 *Customer:* ${customer.name}\n`;
  if (customer.phone) message += `📞 *Phone:* ${customer.phone}\n`;
  if (customer.address) message += `📍 *Address:* ${customer.address}\n`;
  if (customer.paymentMethod) message += `💳 *Payment:* ${customer.paymentMethod}\n`;
  if (customer.trxId) message += `🔖 *TrxID:* ${customer.trxId}\n`;
  message += `--------------------------------\n`;
  message += `*Ordered Items:*\n`;

  let subtotal = 0;
  cartItems.forEach((item, idx) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    message += `${idx + 1}. ${item.name} (${item.qty}x) - ${formatPrice(itemTotal)}\n`;
  });

  message += `--------------------------------\n`;
  message += `💰 *Grand Total:* ${formatPrice(subtotal)}\n`;
  message += `📅 *Date:* ${new Date().toLocaleDateString("en-BD")}\n`;
  message += `--------------------------------\n`;
  message += `_Sent via PTENit Instant Checkout_`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

function orderSingleViaWhatsApp(product) {
  const cleanNumber = getWhatsAppNumber().replace(/[^0-9]/g, "");
  let message = `*🛍️ INQUIRY / ORDER - PTENit*\n`;
  message += `--------------------------------\n`;
  message += `📦 *Product:* ${product.name}\n`;
  message += `💰 *Price:* ${formatPrice(product.price)}\n`;
  message += `🏷️ *Category:* ${product.category || "IT Service"}\n`;
  message += `--------------------------------\n`;
  message += `Hello PTENit team, I would like to order/learn more about this service.`;

  window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

// ==========================================
// 5. NAVBAR & MOBILE MENU SETUP
// ==========================================
function initNavbar() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  
  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      toggleBtn.innerHTML = mobileNav.classList.contains("open")
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });
  }

  // Update User Profile / Login Link
  const user = window.PTENitFirebase ? window.PTENitFirebase.getCurrentUser() : null;
  document.querySelectorAll(".nav-user-link").forEach(link => {
    if (user) {
      link.innerHTML = `
        <span class="badge badge-green" style="font-size:0.8rem; text-transform:none;">
          👤 ${user.displayName || user.email.split("@")[0]}
        </span>
      `;
      link.href = user.isAdmin ? "admin.html" : "admin.html";
      link.title = "অ্যাকাউন্ট ড্যাশবোর্ড";
    } else {
      link.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      `;
      link.href = "login.html";
      link.title = "লগইন করুন";
    }
  });

  // Highlight Active Page
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ==========================================
// 6. FAQ ACCORDION LOGIC
// ==========================================
function initFaq() {
  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const isActive = item.classList.contains("active");

      // Close other open items
      document.querySelectorAll(".faq-item").forEach(other => {
        other.classList.remove("active");
      });

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// ==========================================
// 7. INITIALIZE ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateCartBadge();
  initNavbar();
  initFaq();

  // Attach theme switcher
  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.addEventListener("click", toggleTheme);
  });
});
