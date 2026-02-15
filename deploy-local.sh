#!/bin/bash

# Deploy Feedback App as feedback.local
# This script sets up the application to run on your local network

set -e

echo "=========================================="
echo "Feedback App - Local Network Deployment"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed."
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    if ! docker compose version &> /dev/null 2>&1; then
        echo "Error: Docker Compose is not installed."
        echo "Please install Docker Compose first."
        exit 1
    fi
fi

# Get the local IP address
echo "Detecting local IP address..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    LOCAL_IP=$(hostname -I | awk '{print $1}')
elif [[ "$OSTYPE" == "darwin"* ]]; then
    LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)
else
    echo "Please manually determine your local IP address"
    read -p "Enter your local IP address (e.g., 192.168.1.100): " LOCAL_IP
fi

echo "Detected IP: $LOCAL_IP"
echo ""

# Stop any existing containers
echo "Stopping existing containers..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

# Build and start the containers
echo "Building and starting containers..."
docker compose up -d --build || docker-compose up -d --build

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Access the application at:"
echo "  - http://$LOCAL_IP"
echo "  - http://feedback.local (after hosts file configuration)"
echo ""
echo "To use 'feedback.local' hostname:"
echo ""
echo "1. On Windows (Run as Administrator):"
echo "   Add to C:\\Windows\\System32\\drivers\\etc\\hosts:"
echo "   $LOCAL_IP feedback.local"
echo ""
echo "2. On Linux/Mac (Run with sudo):"
echo "   Add to /etc/hosts:"
echo "   $LOCAL_IP feedback.local"
echo ""
echo "3. For network-wide access, configure your router's DNS:"
echo "   - Login to your router (usually 192.168.1.1)"
echo "   - Look for DNS or Host settings"
echo "   - Add: feedback.local -> $LOCAL_IP"
echo ""
echo "Admin Dashboard: http://feedback.local/admin"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f    # View logs"
echo "  docker compose stop       # Stop containers"
echo "  docker compose restart    # Restart containers"
echo "=========================================="
