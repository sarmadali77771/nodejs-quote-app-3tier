# Node.js Quote App - 3-Tier Architecture

Dockerized three-tier web application for managing inspirational quotes with a MySQL database, Node.js backend, and modern frontend.


![Quote App Screenshot](https://raw.githubusercontent.com/sarmadali77771/nodejs-quote-app-3tier/refs/heads/main/Inspirational-Quotes.png)


## 🏗️ Architecture Overview

This application demonstrates a classic 3-tier architecture pattern:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Presentation   │    │   Application   │    │      Data       │
│     Layer       │◄──►│     Layer       │◄──►│     Layer       │
│                 │    │                 │    │                 │
│  Frontend       │    │  Node.js +      │    │     MySQL       │
│  HTML/CSS/JS    │    │  Express API    │    │   Database      │
│  Port: 3000     │    │  Port: 3001     │    │  Port: 3306     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Features

- **Quote Management**: Add, view, and browse inspirational quotes
- **Real-time Updates**: Frontend updates dynamically without page refresh
- **Word Limit Validation**: Quotes limited to 50 words with live word count
- **Quote History**: Browse through previously added quotes
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-cleanup**: Automatically maintains only the 50 most recent quotes
- **Docker Containerization**: Easy deployment with Docker Compose


## 🛠️ Technology Stack

### Frontend (Presentation Layer)
- HTML5, CSS3, Vanilla JavaScript
- Responsive design
- RESTful API consumption


### Backend (Application Layer)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **mysql2** - MySQL database driver


### Database (Data Layer)
- **MySQL 8.0** - Relational database
- Persistent data storage with Docker volumes

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed on your machine
- Git for cloning the repository



### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sarmadali77771/nodejs-quote-app-3tier.git
   cd nodejs-quote-app-3tier
   ```

2. **Start the application**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   

4. **Stop the application**
   ```bash
   docker-compose down
   ```

## 📁 Project Structure

```
nodejs-quote-app-3tier/
├── backend/
│   ├── db.js              # Database connection and queries
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── Dockerfile         # Backend container configuration
├── frontend/
│   ├── public/
│   │   ├── index.html     # Main HTML file
│   │   ├── style.css      # Styling
│   │   └── script.js      # Frontend JavaScript
│   ├── package.json       # Frontend dependencies
│   └── Dockerfile         # Frontend container configuration
├── docker-compose.yaml    # Multi-container orchestration
└── README.md              # Project documentation
```


## 🐳 Docker Configuration


### Services Overview
- **mysql**: MySQL 8.0 database with persistent storage
- **backend**: Node.js Express API server
- **frontend**: Static file server for HTML/CSS/JS


### Environment Variables
```yaml
MYSQL_HOST: mysql
MYSQL_USER: root
MYSQL_PASSWORD: password
MYSQL_DATABASE: db_quotes
```

### Data Persistence
MySQL data is persisted using Docker volumes to prevent data loss when containers are restarted.


## 🐛 Troubleshooting


### Backend Container Keeps Crashing
1. Check backend logs: `docker-compose logs backend`
2. Ensure MySQL is fully initialized before backend starts
3. Verify all dependencies are installed



### Frontend Not Connecting to Backend
1. Check browser console for CORS errors
2. Verify backend is running on port 3001
3. Test API directly: `curl http://localhost:3001/api/quotes`



### Database Connection Issues
1. Wait for MySQL container health check to pass
2. Check MySQL logs: `docker-compose logs mysql`
3. Verify database credentials in docker-compose.yaml



### Debugging Database Contents
```bash
# Connect to MySQL container
docker exec -it <mysql_container_id> mysql -u root -ppassword db_quotes

# Check quotes table
SELECT * FROM quotes;
```



## 🚦 Future Enhancements

- [ ] CI/CD pipeline setup
      (Automate the software delivery process to improve deployment speed and reliability.)
- [ ] Kubernetes Deployment: High Availability and Self-Healin
      (Ensure that applications are resilient, scalable, and can recover from failures automatically.)



## ⭐ Star this repository if you found it helpful!



## 👨‍💻 Author

**Sarmad Ali**
- GitHub: (https://github.com/sarmadali77771/)
- License: MIT License




