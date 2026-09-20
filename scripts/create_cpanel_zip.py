import os
import zipfile

dist_dir = 'dist'
zip_filename = 'PTENit_public_html_root.zip'

if not os.path.exists(dist_dir):
    print("Error: dist/ directory not found. Please run 'npm run build' first.")
    exit(1)

# Ensure public/.htaccess is copied to dist/.htaccess if missing
if os.path.exists('public/.htaccess') and not os.path.exists('dist/.htaccess'):
    with open('public/.htaccess', 'rb') as f_in, open('dist/.htaccess', 'wb') as f_out:
        f_out.write(f_in.read())

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            if file.startswith('server.cjs') or file.endswith('.zip'):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, dist_dir)
            zipf.write(full_path, rel_path)

print(f"Successfully generated clean {zip_filename} at root level.")
