import subprocess
import time
import os
import http.server
import socketserver
import threading

PORT = 5688
DIRECTORY = "/home/devqii/workspace/music60s/groove66-ui/dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1)

targets = [
    # 1. Discover Screen across 3 viewports
    ("discover_360", "360,800", f"http://localhost:{PORT}/#discover"),
    ("discover_393", "393,852", f"http://localhost:{PORT}/#discover"),
    ("discover_412", "412,915", f"http://localhost:{PORT}/#discover"),

    # 2. Records Screen across 3 viewports
    ("records_360", "360,800", f"http://localhost:{PORT}/#records"),
    ("records_393", "393,852", f"http://localhost:{PORT}/#records"),
    ("records_412", "412,915", f"http://localhost:{PORT}/#records"),

    # 3. Favorites Screen across 3 viewports + segments
    ("favorites_360", "360,800", f"http://localhost:{PORT}/#favorites"),
    ("favorites_393", "393,852", f"http://localhost:{PORT}/#favorites"),
    ("favorites_412", "412,915", f"http://localhost:{PORT}/#favorites"),
    ("favorites_albums_393", "393,852", f"http://localhost:{PORT}/#favorites-albums"),
    ("favorites_playlists_393", "393,852", f"http://localhost:{PORT}/#favorites-playlists"),

    # 4. Search Screen across 3 viewports + states
    ("search_360", "360,800", f"http://localhost:{PORT}/#search"),
    ("search_393", "393,852", f"http://localhost:{PORT}/#search"),
    ("search_412", "412,915", f"http://localhost:{PORT}/#search"),
    ("search_results_393", "393,852", f"http://localhost:{PORT}/#search-results"),
    ("search_filtered_393", "393,852", f"http://localhost:{PORT}/#search-filtered"),

    # 5. Now Playing Turntable Screen across 3 viewports
    ("player_360", "360,800", f"http://localhost:{PORT}/#player"),
    ("player_393", "393,852", f"http://localhost:{PORT}/#player"),
    ("player_412", "412,915", f"http://localhost:{PORT}/#player"),
]

output_dir = "/home/devqii/workspace/music60s/groove66-ui/docs/qa-screenshots"
os.makedirs(output_dir, exist_ok=True)

for name, size, url in targets:
    out_file = os.path.join(output_dir, f"{name}.png")
    cmd = [
        "google-chrome",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--window-size={size}",
        "--virtual-time-budget=2500",
        f"--screenshot={out_file}",
        url
    ]
    print(f"Capturing {name} ({size}) from {url}...")
    subprocess.run(cmd, check=True)
    print(f"Saved {out_file}")

print("\nAll responsive QA screenshots captured successfully!")
