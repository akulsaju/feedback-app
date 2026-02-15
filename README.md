# ADIS Wathba - Feedback Portal

Abu Dhabi Indian School, Branch 1, Al Wathba - A self-hosted feedback and issue reporting portal for students and teachers. No login required. Runs fully offline with a built-in SQLite database.

**📖 Quick Links:** [Deployment Guide](DEPLOYMENT.md) | [Quick Start](QUICK-START.md)

---

## ✨ Features

- **Report New Issue** - Students (GR number) or teachers (Employee ID) can submit queries, complaints, or suggestions
- **Check Case Status** - Look up existing cases by GR/Employee ID or case number
- **Admin Dashboard** - View, filter, and respond to all cases at `/admin`
- **Built-in Database** - Uses SQLite (sql.js) -- no cloud, no external database needed
- **Zero Internet Required** - Runs entirely on your local network

---

## Pages

| Route | Description |
|---|---|
| `/` | Home page with two actions: Report Issue or Check Status |
| `/report` | Submit a new issue/query form |
| `/status` | Look up case status by ID or case number |
| `/admin` | Admin dashboard (password protected) |

---

## Admin Login

- **URL:** `http://<your-ip>/admin`

---

## 🚀 Quick Deploy as feedback.local (Docker - RECOMMENDED)

The easiest way to deploy on your local network with the `feedback.local` hostname.

### Requirements

- [Docker Desktop](https://docs.docker.com/get-docker/) (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (included with Docker Desktop)

### Deploy on Windows

1. **Run the deployment script:**
   ```powershell
   deploy-local.bat
   ```

2. **Configure hostname (Run Notepad as Administrator):**
   - Open: `C:\Windows\System32\drivers\etc\hosts`
   - Add line: `<YOUR_IP> feedback.local` (IP shown in script output)
   - Save and close

3. **Allow through firewall:**
   ```powershell
   netsh advfirewall firewall add rule name="Feedback App" dir=in action=allow protocol=TCP localport=80
   ```

4. **Access:** http://feedback.local

### Deploy on Linux/Mac

1. **Run the deployment script:**
   ```bash
   chmod +x deploy-local.sh
   ./deploy-local.sh
   ```

2. **Configure hostname:**
   ```bash
   sudo nano /etc/hosts
   # Add: <YOUR_IP> feedback.local
   ```

3. **Access:** http://feedback.local

### Network-Wide Access (Optional)

For all devices on your network to access `feedback.local` without editing hosts files:

1. Login to your router (typically 192.168.1.1 or 192.168.0.1)
2. Find DNS/Host settings (often under Advanced or LAN settings)
3. Add DNS entry: `feedback.local` → `<YOUR_SERVER_IP>`

Now any device can access http://feedback.local directly!

### Docker Management Commands

```bash
docker compose logs -f       # View live logs
docker compose restart       # Restart the app
docker compose stop          # Stop the app
docker compose start         # Start the app
docker compose down          # Stop and remove containers
```

---

## Alternative: Manual Setup

### Requirements

- [Node.js](https://nodejs.org/) v18 or later (LTS recommended)
- npm (comes with Node.js)

---

## Quick Start (Any OS)

### 1. Install dependencies

```bash
cd feedback-app
npm install --legacy-peer-deps
```

### 2. Build the app

```bash
npx next build
```

### 3. Start the server

```bash
npx next start -H 0.0.0.0 -p 80
```

### 4. Access the app

- On the same computer: `http://localhost`
- On other devices (same WiFi): `http://<your-ip>`

Find your IP:
- **Windows:** Run `ipconfig` in CMD, look for **IPv4 Address**
- **Linux/Mac:** Run `hostname -I`

---

## Windows Setup (Detailed)

### Install and Run

```powershell
cd C:\Users\your-name\Downloads\feedback-app
npm install --legacy-peer-deps
npx next build
npx next start -H 0.0.0.0 -p 80
```

### Allow Through Firewall

Open PowerShell as Admin:

```powershell
netsh advfirewall firewall add rule name="ADIS Feedback" dir=in action=allow protocol=TCP localport=80
```

### Make It Run Permanently (Windows Service)

Install NSSM:

```powershell
winget install nssm
```

Create the service:

```powershell
nssm install FeedbackApp
```

Fill in the popup window:

| Field | Value |
|---|---|
| Path | `C:\Program Files\nodejs\npx.cmd` |
| Startup Directory | `C:\path\to\feedback-app` |
| Arguments | `next start -H 0.0.0.0 -p 80` |

Click **Install service**, then start it:

```powershell
nssm start FeedbackApp
```

Useful commands:

| Command | What it does |
|---|---|
| `nssm status FeedbackApp` | Check if running |
| `nssm restart FeedbackApp` | Restart the app |
| `nssm stop FeedbackApp` | Stop it |
| `nssm remove FeedbackApp` | Delete the service |

### Set a Static IP (Windows)

1. Open **Settings > Network & Internet > WiFi > Hardware properties**
2. Click **Edit** next to IP assignment
3. Set to **Manual**, toggle **IPv4** on
4. Enter:
   - IP: `192.168.1.100`
   - Subnet: `255.255.255.0`
   - Gateway: `192.168.1.1`
   - DNS: `8.8.8.8`
5. Save

---

## Raspberry Pi Setup

### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
```

### Install and Build

```bash
cd ~/feedback-app
npm install --legacy-peer-deps
npx next build
```

### Run Permanently (systemd Service)

Create the service file:

```bash
sudo nano /etc/systemd/system/feedback.service
```

Paste this:

```ini
[Unit]
Description=ADIS Wathba Feedback Portal
After=network.target

[Service]
WorkingDirectory=/home/pi/feedback-app
ExecStart=/usr/bin/npx next start -H 0.0.0.0 -p 80
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
```

Save with `Ctrl+O`, exit with `Ctrl+X`, then enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable feedback
sudo systemctl start feedback
```

Useful commands:

| Command | What it does |
|---|---|
| `sudo systemctl status feedback` | Check if running |
| `sudo systemctl restart feedback` | Restart the app |
| `sudo systemctl stop feedback` | Stop it |
| `journalctl -u feedback -f` | View live logs |

### Set a Static IP (Raspberry Pi)

```bash
sudo nano /etc/dhcpcd.conf
```

Add at the bottom:

```
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

Reboot:

```bash
sudo reboot
```

---

## Database

The app uses a local SQLite database file (`feedback.db`) that is automatically created in the project root when the app first starts. No setup required.

- All data is stored in `feedback.db`
- Survives app restarts
- Back it up by simply copying the file
- Delete it to reset all data

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite via sql.js (pure JavaScript, zero native dependencies)
- **UI:** shadcn/ui + Tailwind CSS
- **Language:** TypeScript

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `npm install` fails with dependency errors | Use `npm install --legacy-peer-deps` |
| `next` is not recognized | Use `npx next build` and `npx next start` instead |
| Can't access from other devices | Check firewall settings, ensure you're on the same WiFi |
| Port 80 access denied | Run with `sudo` (Linux) or as Admin (Windows), or use port 3000 instead |
| Database reset needed | Delete the `feedback.db` file and restart the app |

---

## Project Structure

```
feedback-app/
  app/
    page.tsx          # Home page
    actions.ts        # Server actions (submit, lookup, update cases)
    report/page.tsx   # Report new issue page
    status/page.tsx   # Check case status page
    admin/page.tsx    # Admin dashboard (password protected)
  components/
    site-header.tsx   # ADIS branded header
    report-form.tsx   # Issue submission form
    status-lookup.tsx # Case status lookup
    admin-dashboard.tsx # Admin case management
  lib/
    db.ts             # SQLite database helper
  feedback.db         # Auto-created database file (after first run)
```

---

Abu Dhabi Indian School, Branch 1, Al Wathba, U.A.E.
P.O. Box 79803 | Affiliated to CBSE (Aff. No. 6630083)
