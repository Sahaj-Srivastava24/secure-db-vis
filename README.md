# Secure WireGuard VPN with Docker-based Database and Frontend

This repository provides an automated setup for a **secure private network** using **WireGuard VPN**, **PostgreSQL database**, and a **frontend visualizer**. Only whitelisted IPs via WireGuard can access the database and frontend.

---

## **Features**
✔ **WireGuard VPN** for secure, IP-restricted access
✔ **Dockerized PostgreSQL Database** for structured data storage
✔ **Frontend Visualizer** to query and display database contents
✔ **Infrastructure as Code (IaC)** using **Docker Compose**
✔ **Firewall Rules** to allow access only via WireGuard VPN
✔ **Automated Deployment Script**

---

## **Infrastructure Overview**
- **WireGuard VPN**: Manages secure access
- **Docker Network**: Ensures internal communication between services
- **PostgreSQL Database**: Stores and manages data
- **Frontend Application**: Queries and displays database data
- **Firewall Configuration**: Restricts access to authorized clients only

---

## **1. Prerequisites**
Ensure the following dependencies are installed:
- Ubuntu 20.04+ or Debian-based system
- **Docker** & **Docker Compose**
- **WireGuard VPN**

---

## **2. Setup Instructions**
### **Step 1: Clone the Repository**
```bash
git clone <repo_url>
cd <repo_directory>
```

### **Step 2: Run the Setup Script**
```bash
chmod +x setup.sh
sudo ./setup.sh
```

This script will:
- Install **WireGuard, Docker, and Docker Compose**
- Configure **WireGuard VPN** and generate keys
- Set up **PostgreSQL Database and Frontend in Docker**
- Apply **firewall rules to restrict access**
- Display **WireGuard client configuration**

---

## **3. WireGuard Client Configuration**
Once the script completes, it will display the WireGuard client configuration. Use this configuration on your client device to connect securely.

Example client config:
```ini
[Interface]
PrivateKey = <CLIENT_PRIVATE_KEY>
Address = 10.8.0.2/24
DNS = 8.8.8.8

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
Endpoint = <SERVER_IP>:51820
AllowedIPs = 10.8.0.0/24
PersistentKeepalive = 25
```

To start WireGuard on the client:
```bash
wg-quick up client.conf
```

---

## **4. Accessing Services**
### **PostgreSQL Database** (Once connected via VPN)
```bash
psql -h 192.168.100.2 -U admin -d mydb
```

### **Frontend Visualizer**
Access the frontend in your browser:
```
http://192.168.100.3:8080
```

---

## **5. Managing Services**
Start containers:
```bash
docker-compose up -d
```

Stop containers:
```bash
docker-compose down
```

List running containers:
```bash
docker ps
```

Inspect Docker network:
```bash
docker network inspect my_secure_network
```

---

## **6. Adding a New WireGuard Client**
To add a new client:
1. **Generate a new key pair**:
   ```bash
   wg genkey | tee client_privatekey | wg pubkey > client_publickey
   ```
2. **Update WireGuard Server Config (`/etc/wireguard/wg0.conf`)**:
   ```ini
   [Peer]
   PublicKey = <NEW_CLIENT_PUBLIC_KEY>
   AllowedIPs = 10.8.0.3/32
   ```
3. **Restart WireGuard**:
   ```bash
   sudo systemctl restart wg-quick@wg0
   ```

---

## **7. Security Considerations**
- **Restrict external access**: Ensure only VPN users can access services
- **Rotate keys periodically**: Generate new WireGuard keys for security
- **Monitor access logs**: Use `wg show` to track connected clients
- **Backup the database**: Regularly backup PostgreSQL data using Docker volumes

---

## **8. Troubleshooting**
### **Check WireGuard Status**
```bash
sudo wg show
```

### **Restart WireGuard**
```bash
sudo systemctl restart wg-quick@wg0
```

### **View Docker Logs**
```bash
docker logs my_database
```

```bash
docker logs my_frontend
```

### **Check Network Connections**
```bash
iptables -L -v -n
```

---

## **9. Conclusion**
This setup ensures a **secure**, **private**, and **containerized environment** where only **authorized VPN users** can access the PostgreSQL database and frontend. It leverages **Docker Compose for scalability** and **WireGuard for security**.

For further customization, modify the `docker-compose.yml` file to add more services or update configurations.

🚀 **Enjoy your secure private network!**