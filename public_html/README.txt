==============================================================================
PTENit - 100% cPanel Upload Ready Website
==============================================================================

Welcome to your PTENit digital marketplace and IT services website.
This project is built using pure HTML5, modern responsive CSS3, and modular
Vanilla JavaScript. It requires NO Node.js, Vite, npm, or terminal build process!

------------------------------------------------------------------------------
1. HOW TO UPLOAD TO cPANEL (Step-by-Step)
------------------------------------------------------------------------------
Step 1: Log in to your cPanel hosting account (e.g. yourdomain.com/cpanel).
Step 2: Open "File Manager" from the Files section.
Step 3: Double-click and enter the "public_html" folder.
Step 4: Select all files & folders inside this project (or compress the
        contents of public_html into a .ZIP archive).
Step 5: Click the "Upload" button at the top bar of File Manager and select
        the .ZIP file.
Step 6: Once uploaded (100% green bar), return to File Manager, right-click
        the uploaded .ZIP file and select "Extract".
Step 7: Verify that `index.html` is located directly in `public_html/index.html`.
Step 8: Visit your website URL in any browser. It will load instantly!

------------------------------------------------------------------------------
2. DIRECTORY STRUCTURE
------------------------------------------------------------------------------
public_html/
├── index.html              -> Homepage (Hero, Services, Products, FAQ, Reviews)
├── products.html           -> Full catalog with live search, filters & sorting
├── product.html            -> Product detail page (Specifications, Qty, Reviews)
├── cart.html               -> Shopping cart, voucher discounts & checkout
├── login.html              -> Client & Admin login portal
├── signup.html             -> Client account registration
├── admin.html              -> Admin Dashboard (Product CRUD, Orders, Settings)
├── about.html              -> Company mission, story & leadership
├── contact.html            -> Inquiry contact form, map & details
├── style.css               -> Comprehensive responsive design & Dark/Light mode
├── script.js               -> Cart logic, WhatsApp messaging & UI controls
├── firebase.js             -> Firebase Authentication, Firestore & Local Fallback
├── assets/
│   ├── logo/
│   │   ├── logo.svg        -> Main vector logo
│   │   └── favicon.svg     -> Browser tab icon
│   └── images/
│       ├── hero-illustration.svg
│       ├── service-web.svg
│       ├── service-software.svg
│       ├── service-cloud.svg
│       ├── service-security.svg
│       ├── qr-bkash.svg
│       └── qr-nagad.svg
└── README.txt              -> This file

------------------------------------------------------------------------------
3. CONNECTING YOUR REAL FIREBASE PROJECT
------------------------------------------------------------------------------
By default, this site includes an automatic "Local Fallback Engine".
It works 100% out-of-the-box with sample products, cart, order submission,
and admin controls stored safely in your browser!

When you are ready to connect to your live Google Firebase account:
1. Go to https://console.firebase.google.com and create a project.
2. In Project Settings > General > "Your apps", click Web (</>) and copy your
   firebaseConfig object.
3. In cPanel File Manager, right-click `firebase.js` and choose "Edit".
4. Replace the placeholder values in `const firebaseConfig = { ... }`:
     apiKey: "YOUR_REAL_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
5. Save the file. Firestore database and Authentication will sync automatically!

------------------------------------------------------------------------------
4. HOW TO UPDATE YOUR WHATSAPP NUMBER
------------------------------------------------------------------------------
You can update the WhatsApp number in two ways:
Option A (Via Admin Dashboard):
  - Go to your website: `yourdomain.com/admin.html`
  - Click on "Store Settings" in the sidebar.
  - Enter your WhatsApp number (e.g. +8801712345678) and click "Save Settings".

Option B (Via Code):
  - Open `script.js` in File Manager.
  - On line 11, edit:
    defaultWhatsApp: "+8801712345678",

------------------------------------------------------------------------------
5. ADMIN ACCESS & CREDENTIALS
------------------------------------------------------------------------------
To access the admin dashboard:
1. Open `yourdomain.com/login.html`
2. Default login credentials:
   Email:    admin@ptenit.com
   Password: admin123
3. From the Admin Panel, you can:
   - Add new products or services with custom images, prices, and badges.
   - Edit or delete existing catalog items.
   - View customer orders with bKash/Nagad Transaction IDs.
   - Change order statuses (Pending, Processing, Completed).
   - One-click message customers on WhatsApp regarding their order.

------------------------------------------------------------------------------
6. SUPPORTED PAYMENT METHODS
------------------------------------------------------------------------------
- bKash (Personal & Merchant with QR code)
- Nagad (Wallet & Send Money with QR code)
- Rocket
- Direct Bank Transfer (City Bank, DBBL, Brac Bank)
- Cash on Delivery (COD)

------------------------------------------------------------------------------
7. BROWSER & PLATFORM COMPATIBILITY
------------------------------------------------------------------------------
- 100% Responsive on Mobile (iPhone/Android), Tablets (iPad), and Desktops.
- Tested on Chrome, Safari, Firefox, Edge, and Samsung Internet.
- Relative file paths ensure the site works seamlessly in root domains
  (e.g., https://ptenit.com) or subdirectories (e.g., https://domain.com/store/).

Developed with pride for PTENit.
==============================================================================
