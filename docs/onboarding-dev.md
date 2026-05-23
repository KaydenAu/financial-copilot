# Developer Onboarding Guide

Welcome to the Financial Copilot project.

This document helps you set up the project and understand the current architecture.

---

# 1. Prerequisites

Before starting, ensure you have installed:

## Required Tools

* Node.js (LTS recommended)
* npm (comes with Node)
* Git
* MySQL (local or Docker)
* Angular CLI

### Install Angular CLI (if not installed)

```powershell
npm install -g @angular/cli
```

---

# 2. Clone the Repository

```
git clone https://github.com/KaydenAu/financial-copilot.git
cd financial-copilot
```

---

# 3. Project Structure

```
apps/
├── frontend/   (Angular application)
├── backend/    (Express js + Prisma API)
```

Each app runs independently (There is no npm workspaces).

---

# 4. Set Up Instructions

## 4.1 Install Dependencies

### Backend

```
cd apps/backend
npm install
```

### Frontend

```
cd ../frontend
npm install
```

---

## 4.2 Environment Setup (Backend)

Create `.env` file:

```
cp .env.example .env
```

Update:

```
DATABASE_URL="mysql://root:password@localhost:3306/financial_copilot"
PORT=3000
JWT_SECRET=your_secret_key
```

---

## 4.3 Database Setup (Prisma)

Ensure MySQL is running and database exists:

```
CREATE DATABASE financial_copilot;
```

Run Prisma migrations:

```
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
```

---

## 4.4 Run Development Servers

### Start Backend

```
cd apps/backend
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

### Start Frontend

```
cd apps/frontend
ng serve --open
```

Frontend runs at:

```
http://localhost:4200
```

---

## 4.5 Test Prisma (Optional)

Open Prisma Studio:

```
cd apps/backend
npx prisma studio
```

This opens a visual database editor.

---

# 5. Authentication Architecture

Authentication is split into two layers:

# 5.1 Core Layer (`core/auth`)

This layer contains  **authentication logic only (no UI)** .

## Responsibilities:

* Authentication service
* Route guards
* JWT interceptor
* User state management

## Structure:

```
core/
└── auth/  
     ├── services/  
     │   └── auth.service.ts  
     ├── guards/  
     │   └── auth.guard.ts  
     ├── interceptors/  
     │   └── jwt.interceptor.ts  
     └── state/      
         └── auth.state.ts
```

---

# 5.2 Feature Layer (`features/auth`)

This layer contains  **UI pages for authentication** .

## Responsibilities:

* Login page
* Register page
* Forgot password page
* Reset password page
* Terms of Services page
* Private Policy page
* Contact Support page
* 404 Error Pages

## Structure:

```
features/
└── auth/  
    ├── login-page/  
    ├── register-page/  
    ├── forgot-password-page/
    ├── reset-password-page/
    ├── terms-of-services-page/
    ├── privacy-policy-page/
    ├── contact-support-page/  
    └── error404-page/
```

---

# 6. Auth Routes

All authentication pages are accessible under:

```
/auth/*
```

## Route Mapping

| Route                   | Page              |
| ----------------------- | ----------------- |
| /auth/login             | Login             |
| /auth/register          | Register          |
| /auth/forgot-password   | Forgot Password   |
| /auth/reset-password    | Reset Password    |
| /auth/terms-of-services | Terms of Services |
| /auth/privacy-policy    | Privacy Policy    |
| /auth/contact-support   | Contact Support   |
| /auth/errors            | 404 Error Page    |

---

## Example Routing Flow

```
User → /auth/login      
    ↓
Login Component loads (eager-loaded)      
    ↓
AuthService handles login logic      
    ↓
JWT / OAuth2 stored in browser      
    ↓
User redirected to dashboard
```

---

# 7. Development Workflow

## Backend development

```
npm run dev
```

## Frontend development

```
ng serve --open
```

## Database changes

```
npx prisma migrate dev --name your_migration_name
```
