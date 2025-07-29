# Inventory Management System

## Overview

The Inventory Management System is a web application designed to help users efficiently manage their inventory. It includes features for adding, updating, viewing, and deleting inventory items, along with secure authentication.

## Features

- **Authentication**: Login and signup functionality with JWT-based session management.
- **Inventory Management**:
  - Add new items with detailed information.
  - View all inventory items with quick stats.
  - Update item quantities.
  - Delete items securely.
- **Dashboard**: A user-friendly interface for inventory management tasks.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB (local or cloud-based)
- **Containerization**: Docker

## Project Structure

```
InventoryManagement/
├── app.js
├── package.json
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── frontend/
```

## Installation

### Method 1: Manual (npm) Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/laveeshdev/InventoryManagement.git
   cd InventoryManagement
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in the root directory and fill in the required values.
3. **Install backend dependencies:**
   ```bash
   npm install
   ```
4. **Start the backend server:**
   ```bash
   npm run dev
   ```
5. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```
6. **Start the frontend server:**
   ```bash
   npm run dev
   ```

---

### Method 2: Docker Compose Setup

1. **Get the latest `docker-compose.yml`:**
   - **Linux/macOS:**
     ```bash
     curl -O https://raw.githubusercontent.com/laveeshdev/InventoryManagement/main/docker-compose.yml
     # or
     wget https://raw.githubusercontent.com/laveeshdev/InventoryManagement/main/docker-compose.yml
     ```
   - **Windows (PowerShell):**
     ```powershell
     Invoke-WebRequest -Uri "https://raw.githubusercontent.com/laveeshdev/InventoryManagement/main/docker-compose.yml" -OutFile "docker-compose.yml"
     ```
2. **Run the application using Docker Compose:**
   - **Linux/macOS:**
     ```bash
     docker-compose up -d
     ```
   - **Windows (PowerShell):**
     ```powershell
     docker-compose up -d
     ```
3. **Access the app:**
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Frontend: [http://localhost:5173](http://localhost:5173)

---

## Access Points

- **Deployed Project**: [https://inventorymanagement-front.onrender.com/](https://inventorymanagement-front.onrender.com/)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **MongoDB**: Accessible at `localhost:27017` (local container)

## Environment Variables

The application requires the following environment variables:

- `PORT`: The port number for the backend server (default: 3000)
- `MONGO_URI`: MongoDB connection string (local or cloud-based)
- `JWT_SECRET`: Secret key for JWT authentication

For local development, use the `.env.example` file to create a `.env` file:

```properties
PORT=3000
MONGO_URI=mongodb://mongodb:27017/inventory_db
JWT_SECRET=your_jwt_secret_key_here
```

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/login`: Login user
- **POST** `/api/v1/auth/signup`: Signup user
- **POST** `/api/v1/auth/logout`: Logout user

### Inventory

- **GET** `/api/v1/product/list`: Get all products
- **POST** `/api/v1/product/add`: Add a new product
- **PUT** `/api/v1/product/:id/quantity`: Update product quantity
- **DELETE** `/api/v1/product/:id`: Delete a product

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [laveeshdev](https://github.com/laveeshdev).
