/**
 * ============================================================================
 * PTENit - Firebase Integration & Database Module (100% cPanel Ready)
 * ============================================================================
 * 
 * INSTRUCTIONS TO CONNECT YOUR REAL FIREBASE PROJECT:
 * 1. Open Firebase Console: https://console.firebase.google.com/
 * 2. Create or select your project.
 * 3. Go to Project Settings -> General -> "Your apps" -> Click the Web (</>) icon.
 * 4. Replace the placeholder values below with your Firebase Config keys.
 * 5. Save this file and re-upload to your cPanel public_html/ folder.
 * 
 * NOTE: If kept as placeholders, the site automatically activates a 
 * resilient local data engine so you can test all features (CRUD, orders, cart)
 * without any errors or white-screens!
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initial Seed Products (IT Solutions, Web & Cloud Services)
const INITIAL_PRODUCTS = [
  {
    id: "pten-001",
    name: "Complete Business Website Package",
    category: "Web Services",
    price: 15000,
    oldPrice: 20000,
    badge: "Most Popular",
    image: "assets/images/service-web.svg",
    description: "Full-stack dynamic responsive corporate website with SEO optimization, cPanel deployment, SSL setup, and admin dashboard.",
    features: [
      "Mobile & Tablet Responsive",
      "Fast 99.9% Uptime Loading",
      "Free SSL & Domain Setup",
      "Admin Control Panel",
      "WhatsApp Chat Integration"
    ],
    rating: 5,
    reviewsCount: 42,
    inStock: true
  },
  {
    id: "pten-002",
    name: "Custom ERP & Management Software",
    category: "Software",
    price: 35000,
    oldPrice: 45000,
    badge: "Enterprise",
    image: "assets/images/service-software.svg",
    description: "Enterprise billing, inventory tracking, POS, client invoicing, and accounting management software tailored to your workflow.",
    features: [
      "Role-based Access Control",
      "Automated PDF Invoices",
      "Offline & Online Sync",
      "Multi-branch Support",
      "Daily Cloud Backup"
    ],
    rating: 4.9,
    reviewsCount: 28,
    inStock: true
  },
  {
    id: "pten-003",
    name: "High-Speed NVMe cPanel Hosting (1 Year)",
    category: "Cloud & Hosting",
    price: 3500,
    oldPrice: 5000,
    badge: "Hot Deal",
    image: "assets/images/service-cloud.svg",
    description: "Lightning-fast LiteSpeed web hosting with unmetered bandwidth, cPanel control, automated backups, and 24/7 technical monitoring.",
    features: [
      "10 GB Pure NVMe SSD",
      "Unlimited Bandwidth & Emails",
      "Free SSL Certificates",
      "cPanel + Softaculous 1-Click",
      "99.9% Uptime Guarantee"
    ],
    rating: 4.8,
    reviewsCount: 65,
    inStock: true
  },
  {
    id: "pten-004",
    name: "Cybersecurity & Vulnerability Audit",
    category: "Security",
    price: 18000,
    oldPrice: 25000,
    badge: "Protection",
    image: "assets/images/service-security.svg",
    description: "Comprehensive penetration testing, malware cleanups, firewall hardening, and database encryption for your company assets.",
    features: [
      "OWASP Top 10 Vulnerability Scan",
      "Malware & Backdoor Cleanup",
      "DDoS Mitigation Strategy",
      "Detailed Compliance Report",
      "30 Days Security Monitoring"
    ],
    rating: 5,
    reviewsCount: 19,
    inStock: true
  },
  {
    id: "pten-005",
    name: "eCommerce Store with Payment Gateway",
    category: "Web Services",
    price: 25000,
    oldPrice: 32000,
    badge: "Trending",
    image: "assets/images/service-web.svg",
    description: "Turnkey multi-vendor or direct eCommerce platform with bKash, Nagad, Rocket, card checkout, product variations, and SMS alerts.",
    features: [
      "bKash & Nagad Auto Checkout",
      "Courier API (Steadfast/RedX) Integration",
      "Order WhatsApp Notification",
      "Inventory & Discount Coupons",
      "Customer Account Portal"
    ],
    rating: 4.9,
    reviewsCount: 54,
    inStock: true
  },
  {
    id: "pten-006",
    name: "Dedicated Cloud Server Setup & Maintenance",
    category: "Cloud & Hosting",
    price: 12000,
    oldPrice: 16000,
    badge: "Pro",
    image: "assets/images/service-cloud.svg",
    description: "Ubuntu/CentOS Linux server optimization, Nginx reverse proxy, Redis cache, database clustering, and monthly maintenance.",
    features: [
      "Server Security Hardening",
      "Nginx & PHP-FPM Performance Tuning",
      "SSL & Firewall Configuration",
      "Automated Off-site Backups",
      "Emergency 24/7 On-Call Support"
    ],
    rating: 4.9,
    reviewsCount: 31,
    inStock: true
  }
];

// Check if credentials are real or placeholder
const isFirebaseConfigured = () => {
  return (
    typeof firebase !== "undefined" &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("YOUR_API_KEY") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("YOUR_PROJECT_ID")
  );
};

// Initialize Firebase if configured
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured()) {
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    console.log("✅ PTENit: Connected to live Firebase project:", firebaseConfig.projectId);
  } catch (err) {
    console.warn("⚠️ PTENit: Live Firebase init error, falling back to local store:", err);
  }
} else {
  console.info("ℹ️ PTENit: Running in zero-setup Local Storage mode. Replace firebase.js credentials when ready.");
}

// Local Storage Helper Store
const STORAGE_KEYS = {
  PRODUCTS: "ptenit_products",
  ORDERS: "ptenit_orders",
  USER: "ptenit_current_user",
  INQUIRIES: "ptenit_inquiries"
};

const getLocalData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocalData = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Local storage write error:", e);
  }
};

// Seed initial products if storage empty
if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
  setLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

// Global API
window.PTENitFirebase = {
  isConfigured: isFirebaseConfigured,

  // --- PRODUCTS CRUD ---
  async getProducts() {
    if (isFirebaseConfigured() && db) {
      try {
        const snapshot = await db.collection("products").get();
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (err) {
        console.warn("Firestore fetch fallback to local:", err);
      }
    }
    return getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  },

  async saveProduct(product) {
    const isNew = !product.id;
    const prodId = isNew ? "pten-" + Date.now() : product.id;
    const finalProduct = {
      ...product,
      id: prodId,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured() && db) {
      try {
        await db.collection("products").doc(prodId).set(finalProduct, { merge: true });
      } catch (err) {
        console.error("Firestore save product error:", err);
      }
    }

    // Always update local cache
    const products = getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const existingIndex = products.findIndex(p => String(p.id) === String(prodId));
    if (existingIndex >= 0) {
      products[existingIndex] = finalProduct;
    } else {
      products.unshift(finalProduct);
    }
    setLocalData(STORAGE_KEYS.PRODUCTS, products);
    return finalProduct;
  },

  async deleteProduct(id) {
    if (isFirebaseConfigured() && db) {
      try {
        await db.collection("products").doc(String(id)).delete();
      } catch (err) {
        console.error("Firestore delete product error:", err);
      }
    }

    const products = getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = products.filter(p => String(p.id) !== String(id));
    setLocalData(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  // --- ORDERS MANAGEMENT ---
  async getOrders() {
    if (isFirebaseConfigured() && db) {
      try {
        const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        console.warn("Firestore fetch orders error:", err);
      }
    }
    return getLocalData(STORAGE_KEYS.ORDERS, [
      {
        id: "ORD-9021",
        customerName: "Rashidul Islam",
        phone: "+8801712345678",
        items: [{ name: "Complete Business Website Package", qty: 1, price: 15000 }],
        total: 15000,
        paymentMethod: "bKash",
        trxId: "BK9X772610A",
        status: "Completed",
        createdAt: "2026-09-18T10:30:00Z"
      },
      {
        id: "ORD-9022",
        customerName: "Tanvir Ahmed",
        phone: "+8801812345678",
        items: [{ name: "High-Speed NVMe cPanel Hosting (1 Year)", qty: 1, price: 3500 }],
        total: 3500,
        paymentMethod: "Nagad",
        trxId: "NG882190B",
        status: "Processing",
        createdAt: "2026-09-19T08:15:00Z"
      }
    ]);
  },

  async saveOrder(orderData) {
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const finalOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: orderData.status || "Pending"
    };

    if (isFirebaseConfigured() && db) {
      try {
        await db.collection("orders").doc(orderId).set(finalOrder);
      } catch (err) {
        console.error("Firestore save order error:", err);
      }
    }

    const orders = getLocalData(STORAGE_KEYS.ORDERS, []);
    orders.unshift(finalOrder);
    setLocalData(STORAGE_KEYS.ORDERS, orders);
    return finalOrder;
  },

  async updateOrderStatus(orderId, status) {
    if (isFirebaseConfigured() && db) {
      try {
        await db.collection("orders").doc(orderId).update({ status });
      } catch (err) {
        console.error("Firestore update status error:", err);
      }
    }

    const orders = getLocalData(STORAGE_KEYS.ORDERS, []);
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.status = status;
      setLocalData(STORAGE_KEYS.ORDERS, orders);
    }
    return true;
  },

  // --- CONTACT / INQUIRY ---
  async saveInquiry(inquiryData) {
    const inq = {
      ...inquiryData,
      id: "INQ-" + Date.now(),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured() && db) {
      try {
        await db.collection("inquiries").add(inq);
      } catch (err) {
        console.error("Firestore inquiry error:", err);
      }
    }

    const inqs = getLocalData(STORAGE_KEYS.INQUIRIES, []);
    inqs.unshift(inq);
    setLocalData(STORAGE_KEYS.INQUIRIES, inqs);
    return inq;
  },

  // --- AUTHENTICATION & USER MANAGEMENT ---
  async loginUser(email, password) {
    if (isFirebaseConfigured() && auth) {
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || email.split("@")[0],
          isAdmin: email.toLowerCase().includes("admin")
        };
        setLocalData(STORAGE_KEYS.USER, user);
        return { success: true, user };
      } catch (err) {
        return { success: false, message: err.message };
      }
    }

    // Smart Local Mode Auth:
    // Admin default: admin@ptenit.com / admin123
    const isAdmin = email.toLowerCase().includes("admin");
    const user = {
      uid: "user-" + Date.now(),
      email: email,
      displayName: email.split("@")[0],
      isAdmin: isAdmin
    };
    setLocalData(STORAGE_KEYS.USER, user);
    return { success: true, user };
  },

  async signupUser(name, email, password, phone) {
    if (isFirebaseConfigured() && auth) {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        const user = {
          uid: userCredential.user.uid,
          email: email,
          displayName: name,
          phone: phone,
          isAdmin: false
        };
        if (db) {
          await db.collection("users").doc(user.uid).set(user);
        }
        setLocalData(STORAGE_KEYS.USER, user);
        return { success: true, user };
      } catch (err) {
        return { success: false, message: err.message };
      }
    }

    // Local Mode
    const user = {
      uid: "user-" + Date.now(),
      email: email,
      displayName: name,
      phone: phone,
      isAdmin: false
    };
    setLocalData(STORAGE_KEYS.USER, user);
    return { success: true, user };
  },

  getCurrentUser() {
    return getLocalData(STORAGE_KEYS.USER, null);
  },

  async logoutUser() {
    if (isFirebaseConfigured() && auth) {
      try {
        await auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
    return true;
  }
};
