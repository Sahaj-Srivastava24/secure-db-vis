#!/bin/bash

# Exit on any error
set -e

echo "============================"
echo " Setting Up Secure Network  "
echo "============================"

# Update system and install WireGuard
echo "[INFO] Installing WireGuard..."
sudo apt update && sudo apt install -y wireguard docker.io docker-compose

# Generate WireGuard keys
echo "[INFO] Generating WireGuard keys..."
umask 077
wg genkey | tee privatekey | wg pubkey > publickey

SERVER_PRIVATE_KEY=$(cat privatekey)
SERVER_PUBLIC_KEY=$(cat publickey)

# Configure WireGuard Server
echo "[INFO] Configuring WireGuard server..."
WG_CONFIG="/etc/wireguard/wg0.conf"
sudo tee $WG_CONFIG > /dev/null <<EOL
[Interface]
PrivateKey = $SERVER_PRIVATE_KEY
Address = 10.8.0.1/24
ListenPort = 51820

PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT
EOL

# Enable and start WireGuard
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
echo "[SUCCESS] WireGuard VPN configured!"

# Create Docker network
echo "[INFO] Creating Docker network..."
docker network create --subnet=192.168.100.0/24 my_secure_network

# Create Docker Compose configuration
echo "[INFO] Creating Docker Compose configuration..."
DOCKER_COMPOSE_FILE="docker-compose.yml"

cat <<EOL > $DOCKER_COMPOSE_FILE
version: '3.8'

services:
  database:
    image: postgres:latest
    container_name: my_database
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    networks:
      my_network:
        ipv4_address: 192.168.100.2
    volumes:
      - db_data:/var/lib/postgresql/data

  frontend:
    image: my-frontend:latest
    container_name: my_frontend
    restart: always
    depends_on:
      - database
    environment:
      DATABASE_HOST: 192.168.100.2
      DATABASE_USER: admin
      DATABASE_PASSWORD: secret
      DATABASE_NAME: mydb
    networks:
      my_network:
        ipv4_address: 192.168.100.3
    ports:
      - "8080:80"

networks:
  my_network:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.100.0/24

volumes:
  db_data:
EOL

# Deploy with Docker Compose
echo "[INFO] Deploying services using Docker Compose..."
docker-compose up -d

# Configure Firewall Rules
echo "[INFO] Configuring firewall rules..."
iptables -A INPUT -p udp --dport 51820 -j ACCEPT
iptables -A INPUT -p tcp --dport 5432 -s 10.8.0.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -s 10.8.0.0/24 -j ACCEPT
echo "[SUCCESS] Firewall configured!"

# Display WireGuard client example
echo "[INFO] WireGuard Client Configuration:"
CLIENT_PRIVATE_KEY=$(wg genkey)
CLIENT_PUBLIC_KEY=$(echo $CLIENT_PRIVATE_KEY | wg pubkey)

sudo tee -a $WG_CONFIG > /dev/null <<EOL

[Peer]
PublicKey = $CLIENT_PUBLIC_KEY
AllowedIPs = 10.8.0.2/32
EOL

sudo systemctl restart wg-quick@wg0

echo "==========================================="
echo "Copy this client configuration:"
echo "-------------------------------------------"
cat <<EOL
[Interface]
PrivateKey = $CLIENT_PRIVATE_KEY
Address = 10.8.0.2/24
DNS = 8.8.8.8

[Peer]
PublicKey = $SERVER_PUBLIC_KEY
Endpoint = <SERVER_IP>:51820
AllowedIPs = 10.8.0.0/24
PersistentKeepalive = 25
EOL
echo "==========================================="
echo "[SUCCESS] Secure Infrastructure Deployed!"
