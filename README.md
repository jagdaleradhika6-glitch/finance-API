# 💰 Finance Backend API

A complete Finance Data Processing and Access Control Backend built with Node.js, Express, MongoDB, and JWT.

---

## 📁 Project Structure

```
finance-backend/
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── authController.js        # Register, login, profile
│   ├── userController.js        # User CRUD (admin)
│   ├── recordController.js      # Financial records CRUD
│   └── dashboardController.js   # Analytics endpoints
├── middleware/
│   ├── auth.js                  # JWT protect + role authorize
│   └── validate.js              # Input validation rules
├── models/
│   ├── User.js                  # User schema (bcrypt + roles)
│   └── FinancialRecord.js       # Finance record schema
├── routes/
│   ├── authRoutes.js            # /api/auth/*
│   ├── userRoutes.js            # /api/users/*
│   ├── recordRoutes.js          # /api/records/*
│   └── dashboardRoutes.js       # /api/dashboard/*
├── services/
│   ├── authService.js           # Auth business logic
│   ├── userService.js           # User business logic
│   ├── recordService.js         # Record business logic
│   └── dashboardService.js      # Analytics aggregations
├── utils/
│   ├── response.js              # Standardized API responses
│   └── logger.js                # Timestamped logger
├── seed.js                      # Test data seeder
├── server.js                    # App entry point
├── .env                         # Environment variables
└── package.json
```

---

## ⚙️ Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Seed test data (optional but recommended)
```bash
node seed.js
```
This creates 3 users and 20 sample records.

### 4. Start the server
```bash
npm run dev      # development (auto-restart)
npm start        # production
```

---

## 🔐 Test Accounts (after seeding)

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Admin   | admin@finance.com       | password123 |
| Analyst | analyst@finance.com     | password123 |
| Viewer  | viewer@finance.com      | password123 |

---

## 📡 API Reference

### Auth
| Method | Endpoint             | Access  | Description         |
|--------|----------------------|---------|---------------------|
| POST   | /api/auth/register   | Public  | Register new user   |
| POST   | /api/auth/login      | Public  | Login               |
| GET    | /api/auth/me         | Any     | Get my profile      |

### Users (Admin only)
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /api/users       | List all users           |
| GET    | /api/users/:id   | Get single user          |
| PATCH  | /api/users/:id   | Update role/status       |
| DELETE | /api/users/:id   | Delete user              |

### Financial Records
| Method | Endpoint           | Access        | Description         |
|--------|--------------------|---------------|---------------------|
| GET    | /api/records       | All           | List (filter/page)  |
| GET    | /api/records/:id   | All           | Get single record   |
| POST   | /api/records       | Admin         | Create record       |
| PUT    | /api/records/:id   | Admin         | Update record       |
| DELETE | /api/records/:id   | Admin         | Delete record       |

### Dashboard (Analyst + Admin)
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/dashboard/summary    | Total income/expense/net |
| GET    | /api/dashboard/categories | Category-wise totals     |
| GET    | /api/dashboard/monthly    | Monthly trend by year    |
| GET    | /api/dashboard/recent     | Recent transactions      |

---

## 🔧 Query Parameters

### GET /api/records
```
?type=income              filter by type (income/expense)
?category=salary          filter by category
?startDate=2024-01-01     filter from date
?endDate=2024-12-31       filter to date
?search=groceries         search in notes
?page=1&limit=10          pagination
?sortBy=date&order=desc   sorting
```

### GET /api/dashboard/categories
```
?type=expense             filter by type
?startDate=2024-01-01     date range
?endDate=2024-03-31
```

### GET /api/dashboard/monthly
```
?year=2024                get monthly trend for a specific year
```

---

## 🔑 Authentication

All protected routes need this header:
```
Authorization: Bearer <your_jwt_token>
```

Get the token from `/api/auth/login` response.

---

## 📦 Example Requests

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "analyst"
}
```

### Create Record
```json
POST /api/records
Authorization: Bearer <admin_token>
{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "date": "2024-01-01",
  "notes": "January salary"
}
```

### Dashboard Summary Response
```json
{
  "success": true,
  "message": "Dashboard summary fetched",
  "data": {
    "totalIncome": 380000,
    "totalExpenses": 143000,
    "netBalance": 237000,
    "totalRecords": 20
  }
}
```

---

## 👥 Role Permissions Summary

| Feature            | Viewer | Analyst | Admin |
|--------------------|--------|---------|-------|
| View records       | ✅     | ✅      | ✅    |
| Create/Edit/Delete | ❌     | ❌      | ✅    |
| Dashboard          | ❌     | ✅      | ✅    |
| User management    | ❌     | ❌      | ✅    |
