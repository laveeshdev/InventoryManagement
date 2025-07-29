# Inventory Management System

## Overview

The Inventory Management System is a web application designed to help users manage their inventory efficiently. It provides features such as adding new items, updating item quantities, viewing inventory, and deleting items. The system also includes authentication for secure access.

## Features

- **Authentication**: Login and signup functionality with session persistence.
- **Inventory Management**:
  - Add new items with detailed information.
  - View all inventory items with quick stats.
  - Update item quantities with different transaction types (adjust, purchase, sale).
  - Delete items with confirmation.
- **Dashboard**: A user-friendly interface to navigate through inventory management tasks.
- **Quick Overview**: Displays total items, total value, and categories.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Styling**: CSS

## Project Structure

```
InventoryManagement/
├── app.js
├── package.json
├── config/
│   ├── connectionDb.js
│   ├── env.js
├── controllers/
│   ├── auth.controller.js
│   ├── listing.controller.js
├── middleware/
│   ├── auth.js
├── models/
│   ├── listing.js
│   ├── user.js
├── routes/
│   ├── auth.route.js
│   ├── product.route.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── AddItemForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── UpdateListPage.jsx
│   │   │   ├── UpdateQuantityPage.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   ├── App.css
│   │   ├── index.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/laveeshdev/InventoryManagement.git
   ```
2. Navigate to the project directory:
   ```bash
   cd InventoryManagement
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   node app.js
   ```
5. Navigate to the `frontend` folder and start the React app:
   ```bash
   cd frontend
   npm i
   npm start
   ```

### Running Only the Backend Using Dockerfile (Without Docker Compose)

If you want to build and run only the backend using Docker CLI and the Dockerfile (not Docker Compose):

1. Make sure you have a `.env` file in the project root with the required variables.
2. Build the backend image:
   ```bash
   docker build -t inventory-backend .
   ```
3. Run the backend container:
   ```bash
   docker run --env-file .env -p 3000:3000 inventory-backend
   ```
   The backend will be available at [http://localhost:3000](http://localhost:3000).

## Running with Docker Compose

To run both the backend, frontend, and local MongoDB using Docker Compose:

1. **Quick Start (Demo/Development)**: You can run the project immediately with a local MongoDB database:
   ```bash
   docker-compose up
   ```
   This will start:
   - MongoDB database (local container)
   - Backend API server (pre-built image: `laveeshdev/inventorypro-backend`)
   - Frontend React application (pre-built image: `laveeshdev/inventorypro-frontend`)
2. **Production Setup**: For production or custom configuration, create a `.env` file:

   - Copy `.env.example` to `.env`
   - Modify the values as needed:
     - `PORT`: The port number for the backend server (default: 3000)
     - `MONGO_URI`: MongoDB connection string (local: `mongodb://mongodb:27017/inventory_db` or Atlas for cloud)
     - `JWT_SECRET`: Your secret key for JWT authentication

3. **Access Points**:
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - MongoDB: `localhost:27017` (accessible from host machine)

**Note**: The local MongoDB setup uses:

- Username: `admin`
- Password: `password123`
- Database: `inventory_db`

To stop all containers, press `Ctrl+C` in the terminal and run:

```bash
docker-compose down
```

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/login`: Login user.
- **POST** `/api/v1/auth/signup`: Signup user.
- **POST** `/api/v1/auth/logout`: Logout user.

### Inventory

- **GET** `/api/v1/product/list`: Get all products.
- **POST** `/api/v1/product/add`: Add a new product.
- **PUT** `/api/v1/product/:id/quantity`: Update product quantity.
- **DELETE** `/api/v1/product/:id`: Delete a product.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [laveeshdev](https://github.com/laveeshdev).

thankyou
