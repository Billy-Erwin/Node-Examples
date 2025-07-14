# Node-Examples API Server

A simple Node.js REST API server for managing user authentication and configuration records. **For demonstration and learning purposes only.**

---

## Table of Contents

- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Configuration Management](#configuration-management)
- [Logout](#logout)
- [Security Recommendations](#security-recommendations)
- [Disclaimer](#disclaimer)

---

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Node-Examples
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the server:**
   ```sh
   node serverAPI.js
   ```
4. **Server runs on:**
   - `http://localhost:3000`

> **Note:** For production or public use, always run behind HTTPS and use environment variables for secrets.

---

## API Endpoints

| Endpoint                   | Method | Description                |
| -------------------------- | ------ | -------------------------- |
| `/api/login`               | POST   | User login                 |
| `/api/getConfigurations`   | GET    | List configurations        |
| `/api/updateConfiguration` | PUT    | Update a configuration     |
| `/api/createConfiguration` | POST   | Create a new configuration |
| `/api/deleteConfiguration` | DELETE | Delete a configuration     |
| `/api/logout`              | POST   | Logout user                |

All endpoints (except `/api/login`) require authentication via a token in the `Authorization` header.

---

## Authentication

### Login

- **Endpoint:** `POST /api/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "username": "demo-user",
    "password": "asdf1234"
  }
  ```
- **Response:**
  - Returns a token in the `Authorization` header (format: `Bearer <token>`)
  - Token TTL: 5 minutes
  - If a request is made within 1 minute of expiration, a new token is issued
  - On expiration, re-authentication is required

> **Security Note:** Passwords should be hashed and never stored in plain text. Use HTTPS to protect credentials in transit.

### Using the Token

- Include the token in the `Authorization` header for all requests:
  ```
  Authorization: Bearer <token>
  ```
- Tokens are returned in every response (except `/api/logout`).

---

## Configuration Management

### Get Configurations

- **Endpoint:** `GET /api/getConfigurations`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "sortBy": "hostname", // string: hostname, name, port, username
    "pageNumber": 5, // integer
    "resultsPerPage": 3, // integer
    "showAll": false // boolean
  }
  ```
- **Response:**
  - JSON object with requested data range and sort order

### Update Configuration

- **Endpoint:** `PUT /api/updateConfiguration`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "newConfig": {
      "name": "demo-server",
      "hostname": "demo.example.com",
      "port": 3000,
      "username": "admin"
    },
    "oldConfig": {
      "name": "name2",
      "hostname": "hostname2",
      "port": 2222,
      "username": "user1"
    }
  }
  ```
- **Response:**
  - Success/error message

### Create Configuration

- **Endpoint:** `POST /api/createConfiguration`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "demo-server",
    "hostname": "demo.example.com",
    "port": 3000,
    "username": "admin"
  }
  ```
- **Response:**
  - Success/error message

### Delete Configuration

- **Endpoint:** `DELETE /api/deleteConfiguration`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "demo-server",
    "hostname": "demo.example.com",
    "port": 3000,
    "username": "admin"
  }
  ```
- **Response:**
  - Success/error message

---

## Logout

- **Endpoint:** `POST /api/logout`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Behavior:**
  - Invalidates the token (adds to blacklist)
  - Expired tokens are periodically cleaned up
- **Response:**
  - Logout message

---

## Security Recommendations

- **Always use HTTPS** to protect credentials and tokens in transit.
- **Hash and salt passwords** before storing (never store plain text passwords).
- **Use environment variables** for secrets and configuration (never hardcode in code or JSON files).
- **Use secure, random tokens** (consider JWT or UUIDs).
- **Validate and sanitize all input** to prevent injection attacks.
- **Implement rate limiting** to prevent brute-force attacks.
- **For production, use a real database** instead of JSON files.

---

## Disclaimer

This project is for demonstration and educational purposes only. It uses JSON files for data storage and does not implement all security best practices required for production systems. For real-world applications, always follow modern security standards and use production-ready tools and frameworks.
