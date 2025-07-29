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
