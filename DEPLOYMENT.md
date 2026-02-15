# Deploy Feedback App as feedback.local

Complete guide to deploying the feedback application on your local network with the `feedback.local` hostname.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Hostname Configuration](#hostname-configuration)
4. [Network-Wide DNS](#network-wide-dns)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- Docker Compose (included with Docker Desktop)

### Windows

```powershell
# Run the deployment script
.\deploy-local.bat

# Edit hosts file (as Administrator)
notepad C:\Windows\System32\drivers\etc\hosts
# Add: <YOUR_IP> feedback.local

# Allow through firewall
netsh advfirewall firewall add rule name="Feedback App" dir=in action=allow protocol=TCP localport=80
```

### Linux/Mac

```bash
# Make script executable and run
chmod +x deploy-local.sh
./deploy-local.sh

# Edit hosts file
sudo nano /etc/hosts
# Add: <YOUR_IP> feedback.local
```

### Access

Open your browser and go to: **http://feedback.local**

Admin dashboard: **http://feedback.local/admin**

---

## Detailed Setup

### Step 1: Install Docker

#### Windows/Mac
1. Download and install [Docker Desktop](https://docs.docker.com/desktop/)
2. Start Docker Desktop
3. Verify installation:
   ```powershell
   docker --version
   docker compose version
   ```

#### Linux
```bash
# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

### Step 2: Deploy the Application

#### Option A: Using Deployment Script (Recommended)

**Windows:**
```powershell
cd path\to\feedback-app
.\deploy-local.bat
```

**Linux/Mac:**
```bash
cd /path/to/feedback-app
chmod +x deploy-local.sh
./deploy-local.sh
```

The script will:
- Detect your local IP address
- Build the Docker images
- Start the containers
- Display access instructions

#### Option B: Manual Docker Compose

```bash
cd /path/to/feedback-app

# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Step 3: Find Your Local IP Address

Your IP address is needed to configure the hostname.

**Windows (PowerShell):**
```powershell
ipconfig | findstr IPv4
```

**Linux:**
```bash
hostname -I | awk '{print $1}'
```

**Mac:**
```bash
ipconfig getifaddr en0
# or
ipconfig getifaddr en1
```

Example: `192.168.1.100`

---

## Hostname Configuration

### Single Device Access

Edit the hosts file on each device that needs access:

#### Windows

1. **Open Notepad as Administrator:**
   - Right-click Notepad
   - Select "Run as administrator"

2. **Open hosts file:**
   ```
   File → Open → C:\Windows\System32\drivers\etc\hosts
   ```

3. **Add entry:**
   ```
   192.168.1.100 feedback.local
   ```
   Replace `192.168.1.100` with your actual server IP

4. **Save and close**

5. **Test:**
   ```powershell
   ping feedback.local
   ```

#### Linux/Mac

1. **Edit hosts file:**
   ```bash
   sudo nano /etc/hosts
   ```

2. **Add entry:**
   ```
   192.168.1.100 feedback.local
   ```
   Replace `192.168.1.100` with your actual server IP

3. **Save:** `Ctrl+O`, then `Enter`

4. **Exit:** `Ctrl+X`

5. **Test:**
   ```bash
   ping feedback.local
   ```

#### iOS/iPadOS

1. iOS doesn't allow editing hosts file without jailbreak
2. Use Network-Wide DNS (below) or access via IP address

#### Android

1. Requires root access to edit hosts file
2. Use Network-Wide DNS (below) or access via IP address

---

## Network-Wide DNS

Configure your router to make `feedback.local` accessible to all devices automatically.

### Step 1: Access Router Admin Panel

Common router addresses:
- `http://192.168.1.1`
- `http://192.168.0.1`
- `http://10.0.0.1`
- Check your router's manual or bottom label

### Step 2: Login

Use your router's admin credentials (check manual or label)

### Step 3: Add DNS Entry

Location varies by router brand:

#### Common Router Interfaces

**TP-Link:**
1. Advanced → Network → DHCP Server
2. Address Reservation or Static IP
3. Add: `feedback.local` → `192.168.1.100`

**Netgear:**
1. Advanced → Setup → LAN Setup
2. Address Reservation
3. Add: `feedback.local` → `192.168.1.100`

**Asus:**
1. LAN → DHCP Server
2. Manual Assignment or DNS
3. Add: `feedback.local` → `192.168.1.100`

**Linksys:**
1. Connectivity → Local Network
2. DHCP Reservations
3. Add: `feedback.local` → `192.168.1.100`

#### Alternative: Pi-hole or Local DNS Server

For advanced users, set up a local DNS server:

**Pi-hole:**
```bash
# Install Pi-hole
curl -sSL https://install.pi-hole.net | bash

# Add local DNS entry
pihole -a addcustomdns 192.168.1.100 feedback.local
```

Then configure your router to use Pi-hole as DNS server.

---

## Firewall Configuration

### Windows Firewall

**Using PowerShell (Administrator):**
```powershell
# Allow port 80 (HTTP)
netsh advfirewall firewall add rule name="Feedback App HTTP" dir=in action=allow protocol=TCP localport=80

# Check rule
netsh advfirewall firewall show rule name="Feedback App HTTP"

# Remove rule (if needed)
netsh advfirewall firewall delete rule name="Feedback App HTTP"
```

**Using Windows Defender Firewall:**
1. Search for "Windows Defender Firewall"
2. Click "Advanced settings"
3. Select "Inbound Rules"
4. Click "New Rule"
5. Port → TCP → Specific local ports: 80
6. Allow the connection
7. Apply to all profiles
8. Name: "Feedback App"

### Linux (UFW)

```bash
# Allow port 80
sudo ufw allow 80/tcp

# Check status
sudo ufw status

# Remove rule (if needed)
sudo ufw delete allow 80/tcp
```

### Linux (iptables)

```bash
# Allow port 80
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Save rules (Debian/Ubuntu)
sudo netfilter-persistent save

# Save rules (RHEL/CentOS)
sudo service iptables save
```

### Mac (Built-in Firewall)

Mac's firewall is application-based, not port-based. Docker Desktop automatically handles this.

---

## Troubleshooting

### Cannot Access feedback.local

**Check DNS Resolution:**
```bash
# Windows
nslookup feedback.local

# Linux/Mac
dig feedback.local
# or
ping feedback.local
```

**Solutions:**
1. Verify hosts file entry is correct
2. Flush DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```
3. Restart browser
4. Try different browser

### Docker Containers Not Starting

**Check Docker status:**
```bash
# Check if Docker is running
docker ps

# Check container logs
docker compose logs

# Rebuild containers
docker compose down
docker compose up -d --build --force-recreate
```

### Port 80 Already in Use

**Windows:**
```powershell
# Find process using port 80
netstat -ano | findstr :80

# Stop the process (replace PID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find process using port 80
sudo lsof -i :80

# Stop the process (replace PID)
sudo kill -9 <PID>
```

**Alternative:** Use a different port in `docker-compose.yml`:
```yaml
nginx:
  ports:
    - "8080:80"  # Access via http://feedback.local:8080
```

### Database Issues

**Reset database:**
```bash
# Stop containers
docker compose down

# Remove database file
rm feedback.db

# Restart
docker compose up -d
```

### Firewall Blocking Access

**Test firewall:**
```bash
# From another device on network
telnet <SERVER_IP> 80
```

If it fails, adjust firewall rules (see Firewall Configuration section)

### Permission Denied Errors

**Linux/Mac:**
```bash
# Ensure script is executable
chmod +x deploy-local.sh

# Run Docker commands with sudo if needed
sudo docker compose up -d
```

### Cannot Build Docker Image

**Clear Docker cache:**
```bash
# Remove all stopped containers, unused networks, and dangling images
docker system prune -a

# Rebuild
docker compose build --no-cache
docker compose up -d
```

---

## Managing the Application

### Start/Stop/Restart

```bash
# Start
docker compose start

# Stop
docker compose stop

# Restart
docker compose restart

# Stop and remove containers
docker compose down
```

### View Logs

```bash
# View all logs
docker compose logs

# Follow logs (live)
docker compose logs -f

# View specific service logs
docker compose logs feedback-app
docker compose logs nginx
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose down
docker compose up -d --build
```

### Backup Database

```bash
# Copy database file
cp feedback.db feedback.db.backup

# Or use Docker volume
docker compose down
cp feedback.db feedback-backup-$(date +%Y%m%d).db
docker compose up -d
```

### Restore Database

```bash
# Stop containers
docker compose down

# Restore database
cp feedback.db.backup feedback.db

# Start containers
docker compose up -d
```

---

## Security Considerations

1. **Access Control:** The admin dashboard should be password-protected. Ensure you set a strong password.

2. **Network Isolation:** This setup is designed for local network use only. Do not expose port 80 to the internet without proper security measures.

3. **HTTPS:** For production use, consider setting up HTTPS with Let's Encrypt or self-signed certificates.

4. **Regular Backups:** Backup `feedback.db` regularly to prevent data loss.

5. **Updates:** Keep Docker and the application updated with security patches.

---

## Advanced Configuration

### Custom Port

Edit `docker-compose.yml`:
```yaml
nginx:
  ports:
    - "8080:80"  # Use port 8080 instead
```

Then access via: `http://feedback.local:8080`

### Multiple Hostnames

Add to hosts file:
```
192.168.1.100 feedback.local
192.168.1.100 feedback
192.168.1.100 adis-feedback.local
```

### Static IP Assignment

Ensure your server always has the same IP:

**Windows:** Settings → Network → WiFi → Hardware properties → IP assignment → Manual

**Linux/Mac:** Edit network configuration to use static IP instead of DHCP

---

## Support

For issues specific to this deployment:
1. Check logs: `docker compose logs -f`
2. Verify network connectivity
3. Check firewall settings
4. Review router DNS configuration

---

**Access your feedback portal at: http://feedback.local**

**Admin dashboard at: http://feedback.local/admin**
