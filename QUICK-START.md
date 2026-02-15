# Quick Reference: Deploy as feedback.local

## 🚀 Quick Deploy

### Windows
```powershell
.\deploy-local.bat
# Edit hosts file (as Admin): C:\Windows\System32\drivers\etc\hosts
# Add: <YOUR_IP> feedback.local
```

### Linux/Mac
```bash
./deploy-local.sh
# Edit hosts file: sudo nano /etc/hosts
# Add: <YOUR_IP> feedback.local
```

### Access
- **App:** http://feedback.local
- **Admin:** http://feedback.local/admin

---

## 📋 Common Commands

```bash
# View logs
docker compose logs -f

# Restart
docker compose restart

# Stop
docker compose stop

# Start
docker compose start

# Remove containers
docker compose down

# Rebuild
docker compose up -d --build
```

---

## 🔧 Troubleshooting

### Can't access feedback.local
```bash
# Flush DNS (Windows)
ipconfig /flushdns

# Flush DNS (Mac)
sudo killall -HUP mDNSResponder

# Flush DNS (Linux)
sudo systemd-resolve --flush-caches

# Test resolution
ping feedback.local
```

### Port 80 in use
```bash
# Find process (Windows)
netstat -ano | findstr :80

# Find process (Linux/Mac)
sudo lsof -i :80

# Or use different port in docker-compose.yml:
# ports: - "8080:80"
```

### View errors
```bash
docker compose logs feedback-app
docker compose logs nginx
```

---

## 🌐 Network-Wide Access

1. Login to router (usually 192.168.1.1)
2. Find DNS/DHCP settings
3. Add: `feedback.local` → `<SERVER_IP>`
4. All devices can now access without editing hosts file

---

## 🔐 Firewall

### Windows (PowerShell as Admin)
```powershell
netsh advfirewall firewall add rule name="Feedback App" dir=in action=allow protocol=TCP localport=80
```

### Linux (UFW)
```bash
sudo ufw allow 80/tcp
```

---

## 💾 Backup

```bash
# Stop app
docker compose down

# Backup database
cp feedback.db feedback-backup-$(date +%Y%m%d).db

# Start app
docker compose up -d
```

---

## 📁 Files

- `docker-compose.yml` - Container orchestration
- `Dockerfile` - App container definition
- `nginx.conf` - Web server config
- `.env.example` - Environment template
- `deploy-local.sh` - Linux/Mac deployment
- `deploy-local.bat` - Windows deployment
- `DEPLOYMENT.md` - Full documentation

---

## 🆘 Getting Help

1. Check logs: `docker compose logs -f`
2. Review: `DEPLOYMENT.md` for detailed guide
3. Verify Docker: `docker --version`
4. Check network: `ping feedback.local`

---

**Full documentation:** See `DEPLOYMENT.md`
