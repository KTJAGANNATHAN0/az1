import os
from PIL import Image
from collections import deque

# Directories
res_dir = r"c:\Programing Codes\letsgogo\code\resources"
backup_dir = os.path.join(res_dir, "backup")

# Configuration mapping: (original user upload file) -> (code target file, target height)
logo_configs = {
    # 8 BIG LOGOS (scaled to 64px height)
    "01_microsoft.png": ("Microsoft_logo_(2012)_svg.png", 64),
    "02_google_cloud.png": ("654bda7f55747d2628e81451_[NOV-2023]-Google-Cloud-Partner_website_badge.png", 64),
    "03_fortinet.png": ("FortinetLogo.png", 64),
    "04_sophos.png": ("sophos.png", 64),
    "06_kaseya.png": ("kaseya.png", 64),
    "08_leadetr_computers.png": ("LEADETR COMPUTERS.png", 64),
    "10_watchguard_flowwright.png": ("fw.png", 64),
    "11_automation_anywhere.png": ("aa.png", 64),
    
    # 4 STANDARD/BALANCED LOGOS (scaled smaller)
    "12_ingram_micro.png": ("ig.png", 42),
    "05_datto.png": ("datto.png", 38),
    "07_kaspersky.png": ("kaspersky.png", 42),
    "09_juniper_networks.png": ("jun.png", 42)
}

def process_logo(input_path, output_path, tgt_h):
    print(f"Processing: {os.path.basename(input_path)} -> height {tgt_h}px...")
    
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    width, height = img.size
    data = img.load()
    
    # Flood-fill corner algorithm to make background transparent
    visited = set()
    queue = []
    for cx, cy in [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]:
        r, g, b, a = data[cx, cy]
        if a < 50 or (r > 215 and g > 215 and b > 215):
            queue.append((cx, cy))
            visited.add((cx, cy))
            
    q = deque(queue)
    while q:
        x, y = q.popleft()
        r, g, b, a = data[x, y]
        data[x, y] = (r, g, b, 0)
        
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    nr, ng, nb, na = data[nx, ny]
                    if na < 50 or (nr > 210 and ng > 210 and nb > 210):
                        visited.add((nx, ny))
                        q.append((nx, ny))
                        
    # Convert dark text to white for contrast
    for y in range(height):
        for x in range(width):
            r, g, b, a = data[x, y]
            if a > 30:
                sat = max(r, g, b) - min(r, g, b)
                brightness = max(r, g, b)
                if (sat < 30 and brightness < 140) or (r < 90 and g < 90 and b < 90):
                    data[x, y] = (255, 255, 255, a)
                    
    # Crop to content box
    bbox = img.getbbox()
    if bbox:
        img_trimmed = img.crop(bbox)
    else:
        img_trimmed = img
        
    w, h = img_trimmed.size
    aspect = w / h
    
    # Calculate target dimensions
    tgt_w = int(tgt_h * aspect)
    
    # Cap dimensions to canvas limit safety margins (max 216w, 86h)
    if tgt_w > 216:
        tgt_w = 216
        tgt_h = int(tgt_w / aspect)
        
    print(f"  Scaled size: {tgt_w}x{tgt_h} (aspect={aspect:.2f})")
    img_resized = img_trimmed.resize((tgt_w, tgt_h), Image.Resampling.LANCZOS)
    
    # Center on standard 220x96 canvas
    canvas = Image.new("RGBA", (220, 96), (0, 0, 0, 0))
    offset_x = (220 - tgt_w) // 2
    offset_y = (96 - tgt_h) // 2
    canvas.paste(img_resized, (offset_x, offset_y), img_resized)
    
    canvas.save(output_path, "PNG")
    print(f"  Saved to {output_path}")

for uploaded_name, (target_name, tgt_height) in logo_configs.items():
    backup_path = os.path.join(backup_dir, uploaded_name)
    target_path = os.path.join(res_dir, target_name)
    
    if os.path.exists(backup_path):
        try:
            process_logo(backup_path, target_path, tgt_height)
        except Exception as e:
            print(f"Error processing {uploaded_name}: {e}")
    else:
        print(f"Backup file not found: {uploaded_name}")

print("All logos processed!")
