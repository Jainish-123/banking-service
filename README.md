# Banking-Service

![Docker CI](https://github.com/Jainish-123/banking-service/actions/workflows/ci.yml/badge.svg)

Backend service for banking application in **Node.js**, **Express**, **MySQL** and **Prisma**.

---

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL (via Prisma ORM)
- **Testing**: Jest
- **Package Manager**: npm

---

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (>= 18.x recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (>= 8.x)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop)

Verify installations:

```bash
node -v
npm -v
mysql --version
docker -v
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Jainish-123/banking-service.git

cd banking-service
```

### 2. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

#### Create .env file in your root directory with below variables

- DATABASE_URL="mysql://<DB_USERNAME>:<DB_PASSWORD>@localhost:3306/<DB_NAME>"
- JWT_SECRET="<YOUR_JWT_SECRET>"
- JWT_EXPIRES_IN="1h"
- PORT=4000
- NODE_ENV="development"
- ADMIN_NAME="Admin"
- ADMIN_EMAIL="admin@example.com"
- ADMIN_PASSWORD="<YOUR_ADMIN_PASSWORD>"

### 3. Database Setup (Prisma + MySQL)

#### 1. Create a new database in MySQL:

```sql
    CREATE DATABASE DB_NAME;
```

#### 2. Run Prisma migrations (this will generate schema and tables):

```bash
npx prisma migrate dev
```

#### 3. Generate Prisma Client (required for interacting with DB):

```bash
npx prisma generate
```

#### 4. Seed the database with Admin data:

```bash
npx ts-node prisma/seed.ts
```

---

## Run Application

### 1. Development mode

```bash
npm run dev
```

### 2. Production build

```bash
npm run build
npm start
```

### The server should now be running at:

http://localhost:4000

---

## Run Tests

### 1. Run all tests

```bash
npm test
```

### 2. Run all tests

```bash
npm run test:coverage
```

---

## Run with Docker (Recommended)

You can run the application using Docker Compose without installing Node.js or MySQL locally.

### 1. Clone the repository

```bash
git clone https://github.com/Jainish-123/banking-service.git
cd banking-service
```

### 2. Create .env file

```bash
cp .env.example .env
```

### 3. Start the application

```bash
docker compose up
```

---

## API Documentation

This project uses **Swagger** for API documentation. Once the server is running, you can access the Swagger UI at:

http://localhost:4000/api-docs/
