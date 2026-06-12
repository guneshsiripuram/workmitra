# WorkMitra 🛠️
> **Connecting Local Service Demand with Skilled Informal Labor**

WorkMitra ("Worker's Friend") is a peer-to-peer web platform that connects local customers who need household services with verified, nearby skilled workers (plumbers, electricians, carpenters, painters, and mechanics). 

It is designed to solve visibility issues in the informal labor sector, remove middleman exploitation, and provide a direct, secure interface for service matching.

---

## 🌟 Key Features (V1 MVP)
- **Role-Based Portals:** Dedicated dashboards for **Customers** (to find and book help) and **Workers** (to manage profiles and incoming requests).
- **Secure JWT Authentication:** Token-based stateless authentication with password hashing using **BCrypt** via **Spring Security**.
- **Worker Registry & Search:** Customers can browse workers and filter them by skill category (Electrician, Plumber, Carpenter, Mechanic, Painter).
- **Service Request Workflow:** Customers submit job descriptions and addresses directly. Workers see incoming requests on their dashboard and can **Accept** or **Reject** them.
- **Auto-Database Initializer:** Auto-populates the database on first boot with mock workers (and profile photos) for instant demonstration.
- **Automated PowerShell API Test Suite:** Includes an end-to-end command-line testing script that verifies the full matching cycle.

---

## 🏗️ System Architecture

WorkMitra uses a decoupled **Client-Server Architecture** allowing the frontend and backend to scale and deploy independently:

```
                  +---------------------------+
                  |  React Frontend (SPA)     |
                  |  (Vite, Context, Axios)   |
                  +-------------+-------------+
                                |
                   HTTPS (JSON + JWT Bearer)
                                |
                                v
                  +-------------+-------------+
                  |  Spring Security Gateway   |
                  |  (JWT Filter & BCrypt)    |
                  +-------------+-------------+
                                |
                                v
                  +-------------+-------------+
                  |  Spring Boot REST API     |
                  |  (Controllers & Services) |
                  +-------------+-------------+
                                |
                         Spring Data JPA
                                |
                                v
                  +-------------+-------------+
                  |    MySQL Database (Local)  |
                  |  (Tables: users, profiles)|
                  +---------------------------+
```

---

## 📊 Database Schema (MySQL)

Hibernate automatically generates the following relational tables on startup:
1. **`users`**: Stores credentials (ID, Name, unique Mobile Number, BCrypt-hashed Password, and Role: `CUSTOMER`/`WORKER`).
2. **`worker_profiles`**: Has a **One-to-One** relationship with `users` (holds Skill, Location, Experience, and Photo URL).
3. **`work_requests`**: Maps a Customer and a Worker to the same `users` table via **Many-to-One** foreign keys (stores Address, Job Description, Phone, and Status: `PENDING`/`ACCEPTED`/`REJECTED`).

---

## 🔌 API Endpoints Contract

### Public Auth Endpoints
- `POST /api/auth/register` - Register a new account (Name, Phone, Password, Role).
- `POST /api/auth/login` - Authenticate credentials and receive a JWT token.

### Worker Profiles (Authenticated)
- `POST /api/workers/profile` - Create/update profile (Worker only).
- `GET /api/workers` - Browse all workers (optionally filter by `?skill=ELECTRICIAN`).
- `GET /api/workers/{id}` - Fetch details of a specific worker.

### Work Bookings (Authenticated)
- `POST /api/requests` - Submit a new work request (Customer only).
- `GET /api/requests/customer` - View submitted request history (Customer only).
- `GET /api/requests/worker` - View incoming booking requests (Worker only).
- `PUT /api/requests/{id}/status` - Accept or reject a booking (Worker only).

---

## 🚀 How to Run Locally

### Prerequisites
- **Java JDK 17** (or higher)
- **Node.js** (v18+)
- **MySQL** (via XAMPP, WampServer, or standalone)

### 1. Database Setup
1. Start **XAMPP Control Panel** and click **Start** next to **MySQL**.
2. No manual database creation or SQL importing is required; the application automatically creates the database `workmitra_db` and all tables on first startup.

### 2. Run Backend (Spring Boot)
Open a terminal in the `backend/` folder and run:
```bash
./mvnw.cmd spring-boot:run
```
*The server will start on port `8081`.*

### 3. Run Frontend (React)
Open a separate terminal in the `frontend/` folder and run:
```bash
npm install
npm run dev
```
*The React dev server will start on `http://localhost:5173/`.*

### 4. Running Automated API Tests
You can run the full end-to-end API test suite directly in PowerShell:
```powershell
./test_api.ps1
```

---

## 🛠️ Technology Stack
- **Backend:** Java 17, Spring Boot 3.2.x, Spring Security, Spring Data JPA, Hibernate, JWT (JJWT), MySQL, Lombok.
- **Frontend:** React, Vite, Axios, React Router DOM, Lucide Icons, Vanilla CSS (Custom tokens).
- **Tools:** Maven Wrapper, PowerShell.
