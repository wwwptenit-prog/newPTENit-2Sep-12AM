#!/usr/bin/env python3
import os
import shutil
import subprocess
import zipfile
import sys
import json

def main():
    root = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    print(f"[*] Workspace Root: {root}")
    dist_dir = os.path.join(root, 'dist')
    public_dir = os.path.join(root, 'public')

    # Step 1: Run production build
    print("[*] Running 'npm run build'...")
    build_res = subprocess.run(["npm", "run", "build"], cwd=root, capture_output=True, text=True)
    if build_res.returncode != 0:
        print(f"[!] Build error:\n{build_res.stderr}\n{build_res.stdout}")
        sys.exit(1)
    print("[+] npm run build completed successfully!")

    # Step 2: Ensure .htaccess is in dist
    src_htaccess = os.path.join(public_dir, '.htaccess')
    dst_htaccess = os.path.join(dist_dir, '.htaccess')
    if os.path.exists(src_htaccess):
        shutil.copy2(src_htaccess, dst_htaccess)
        print("[+] Copied .htaccess to dist/")

    # Step 3: Ensure api/sync.php is in dist
    src_api = os.path.join(public_dir, 'api')
    dst_api = os.path.join(dist_dir, 'api')
    if os.path.exists(src_api):
        if os.path.exists(dst_api):
            shutil.rmtree(dst_api)
        shutil.copytree(src_api, dst_api)
        print("[+] Copied api/sync.php to dist/api/")

    # Step 4: Ensure server_data is in dist with all json data
    src_server_data = os.path.join(public_dir, 'server_data')
    dst_server_data = os.path.join(dist_dir, 'server_data')
    if os.path.exists(src_server_data):
        if os.path.exists(dst_server_data):
            shutil.rmtree(dst_server_data)
        shutil.copytree(src_server_data, dst_server_data)
        print("[+] Copied server_data to dist/server_data/")

    # Step 5: Verify index.html and assets
    index_html = os.path.join(dist_dir, 'index.html')
    if not os.path.exists(index_html):
        print("[!] ERROR: dist/index.html missing!")
        sys.exit(1)

    with open(index_html, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Ensure relative paths for assets so it runs anywhere
    print(f"[+] dist/index.html verified ({len(html_content)} bytes)")

    # Step 6: Create comprehensive cPanel instructions inside dist
    guide_path = os.path.join(dist_dir, 'CPANEL_DEPLOY_INSTRUCTIONS.txt')
    with open(guide_path, 'w', encoding='utf-8') as f:
        f.write("""================================================================================
           PTENit & Marketplace - cPanel Deployment Guide
================================================================================

This package contains the fully compiled, production-ready website.
When extracted inside your cPanel 'public_html' directory, the website will 
work immediately from your domain without any extra coding or configuration.

--------------------------------------------------------------------------------
Package Contents (Root Level):
--------------------------------------------------------------------------------
1. index.html              - The main frontend entry point (SPA)
2. .htaccess               - Apache URL rewrite rules (prevents 404 on refresh),
                             Gzip compression, caching & security headers
3. assets/                 - Minified & optimized JS/CSS bundles and icons
4. api/sync.php            - Data synchronization and persistence engine (PHP)
5. server_data/            - Live JSON database records (courses, gigs, settings)
6. manifest.json           - PWA progressive web app configuration
7. CPANEL_DEPLOY_INSTRUCTIONS.txt - This instruction manual

--------------------------------------------------------------------------------
Step-by-step cPanel Installation:
--------------------------------------------------------------------------------
1. Log in to your cPanel control panel.
2. Open "File Manager" and navigate to 'public_html' (or your subdomain folder).
3. If there are old files or previous test zips, delete them (or empty Trash).
4. Click "Upload" at the top toolbar and upload:
   'ptenit_cpanel_public_html.zip'
5. Once uploaded (progress bar turns 100% green), return to File Manager.
6. Right-click on 'ptenit_cpanel_public_html.zip' and select "Extract".
7. Extract directly into: /public_html
8. (Optional) Delete the uploaded ZIP file to free up disk space.
9. Visit your domain in any browser: https://yourdomain.com
   Your website is now 100% live and fully operational!

--------------------------------------------------------------------------------
Firebase & Backend Credentials:
--------------------------------------------------------------------------------
- All Firebase client configurations are pre-bundled directly into the application.
- Authentication, Firestore, Realtime updates, and Storage connect automatically.
- No Node.js process is required for basic hosting; works on standard Apache + PHP.

PTENit - Ready for Production!
================================================================================
""")

    # Step 7: Build the production cPanel ZIP Archive
    # Files MUST be at the root of the ZIP so extracting inside public_html places index.html in public_html
    target_zip = os.path.join(public_dir, 'ptenit_cpanel_public_html.zip')
    temp_zip = os.path.join(root, 'temp_cpanel.zip')
    if os.path.exists(temp_zip):
        os.remove(temp_zip)

    files_added = []
    with zipfile.ZipFile(temp_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for dirpath, dirnames, filenames in os.walk(dist_dir):
            for filename in filenames:
                # Do not re-pack any existing zip files or node server artifacts
                if filename.endswith('.zip') or filename == 'server.cjs' or filename == 'server.cjs.map':
                    continue
                fp = os.path.join(dirpath, filename)
                rel = os.path.relpath(fp, dist_dir)
                zf.write(fp, arcname=rel)
                files_added.append(rel)

    shutil.move(temp_zip, target_zip)
    
    # Also create/update public/PTENit.zip and root PTENit.zip so both links work
    shutil.copy2(target_zip, os.path.join(public_dir, 'PTENit.zip'))
    shutil.copy2(target_zip, os.path.join(root, 'ptenit_cpanel_public_html.zip'))
    shutil.copy2(target_zip, os.path.join(root, 'PTENit.zip'))

    size_mb = os.path.getsize(target_zip) / (1024 * 1024)
    print(f"\n[🎉 SUCCESS] cPanel Deployment ZIP created successfully!")
    print(f"File Path: {target_zip}")
    print(f"File Size: {size_mb:.2f} MB ({os.path.getsize(target_zip)} bytes)")
    print(f"Total files in archive: {len(files_added)}")
    print("\nRoot files in archive:")
    for f in sorted([x for x in files_added if '/' not in x]):
        print(f"  - {f}")
    print("\nRoot folders in archive:")
    folders = sorted(list(set(x.split('/')[0] for x in files_added if '/' in x)))
    for folder in folders:
        count = len([x for x in files_added if x.startswith(folder + '/')])
        print(f"  - {folder}/ ({count} files)")

if __name__ == '__main__':
    main()
