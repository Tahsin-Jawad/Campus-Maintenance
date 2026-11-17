# EWU Campus Maintenance & Facility Issue Reporting System

A web-based platform for reporting, managing, and tracking maintenance issues at East West University (EWU).

<<<<<<< HEAD
\<p align="center">   \<a href="[https://campus-maintenance.pages.dev](https://campus-maintenance.pages.dev)">\<strong>🚀 Live Demo\</strong>\</a>   &nbsp; | &nbsp;   \<a href="[https://github.com/Tahsin-Jawad/Campus-Maintenance](https://github.com/Tahsin-Jawad/Campus-Maintenance)">\<strong>GitHub Repository\</strong>\</a> \</p>

## About the Project

The EWU Campus Maintenance System provides a centralized platform where students and faculty members can report campus facility problems.

Administrators can review complaints, assign them to maintenance staff, and monitor their progress. Staff members can manage assigned tasks and update complaint statuses.

The goal is to make campus maintenance more organized, transparent, and efficient.

## Main Features
=======
**[🚀 Live Demo](https://campus-maintenance.pages.dev)** | **[GitHub Repository](https://github.com/Tahsin-Jawad/Campus-Maintenance)**

---

## About the Project

The EWU Campus Maintenance System is a centralized platform where students and faculty members can report campus facility problems.

Administrators can review complaints, assign them to maintenance staff, and monitor their progress. Staff members can manage assigned tasks and update complaint statuses.

The goal is to make campus maintenance more organized, transparent, and efficient.

## Features
>>>>>>> 6c614db (Improve project README formatting)

- User Registration and Login
- Role-Based Authentication
- Student and Faculty Complaint Submission
- Complaint Tracking and History
- Admin Dashboard
- Maintenance Staff Dashboard
- Complaint Assignment to Staff
- Complaint Status Management
- Complaint History Tracking
- User Feedback and Rating System

## User Roles

<<<<<<< HEAD
| Role              | Responsibilities                             |
| ----------------- | -------------------------------------------- |
| Student           | Submit complaints and track progress         |
| Faculty           | Report campus facility issues                |
| Admin             | Manage complaints and assign staff           |
=======
| Role | Responsibilities |
|---|---|
| Student | Submit complaints and track progress |
| Faculty | Report campus facility issues |
| Admin | Manage complaints and assign staff |
>>>>>>> 6c614db (Improve project README formatting)
| Maintenance Staff | Handle assigned complaints and update status |

## Technology Stack

<<<<<<< HEAD
| Component         | Technology                    |
| ----------------- | ----------------------------- |
| Frontend          | HTML, CSS, JavaScript         |
| Backend           | Node.js, Express.js           |
| Database          | TiDB Cloud (MySQL compatible) |
| Database Driver   | mysql2                        |
| Authentication    | JSON Web Token (JWT)          |
| Password Security | bcryptjs                      |
| Version Control   | Git, GitHub                   |

## Database Design

Database name: `ewu_campus_maintenance`
=======
| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | TiDB Cloud (MySQL compatible) |
| Database Driver | mysql2 |
| Authentication | JSON Web Token (JWT) |
| Password Security | bcryptjs |
| Version Control | Git, GitHub |

## Database Design

**Database Name:** `ewu_campus_maintenance`

The database contains 9 tables:
>>>>>>> 6c614db (Improve project README formatting)

The database contains 9 tables:

<<<<<<< HEAD
| Table             | Purpose                     |
| ----------------- | --------------------------- |
| roles             | Stores user roles           |
| users             | Stores user information     |
| locations         | Stores campus locations     |
| categories        | Stores complaint categories |
| statuses          | Stores complaint statuses   |
| complaints        | Stores complaint details    |
| staff_assignments | Stores staff assignments    |
| complaint_history | Stores complaint history    |
| feedback          | Stores user feedback        |

Primary Keys and Foreign Keys maintain relationships and data integrity.

## Project Architecture

1. The frontend sends API requests to the backend.
2. The backend validates requests and handles application logic.
3. The backend communicates with the database.
4. The database stores and retrieves application data.
5. The backend returns responses to the frontend.

## Deployment

| Component   | Platform         |
| ----------- | ---------------- |
| Frontend    | Cloudflare Pages |
| Backend API | Render           |
| Database    | TiDB Cloud       |

**Live Website:** [https://campus-maintenance.pages.dev](https://campus-maintenance.pages.dev)

**Backend API:** [https://ewu-campus-maintenance-api.onrender.com](https://ewu-campus-maintenance-api.onrender.com)

## Run Locally

### Prerequisites

- Node.js and npm
- A configured TiDB Cloud database

### 1. Clone the repository

=======
Primary Keys and Foreign Keys maintain relationships and data integrity.

## Project Architecture

1. The frontend sends API requests to the backend.
2. The backend validates requests and handles application logic.
3. The backend communicates with the database.
4. The database stores and retrieves application data.
5. The backend returns responses to the frontend.

## Deployment

| Component | Platform |
|---|---|
| Frontend | Cloudflare Pages |
| Backend API | Render |
| Database | TiDB Cloud |

- **Live Website:** https://campus-maintenance.pages.dev
- **Backend API:** https://ewu-campus-maintenance-api.onrender.com

## Run Locally

### Prerequisites

- Node.js and npm
- A configured TiDB Cloud database

### 1. Clone the Repository

>>>>>>> 6c614db (Improve project README formatting)
```bash
git clone https://github.com/Tahsin-Jawad/Campus-Maintenance.git
cd Campus-Maintenance
```

<<<<<<< HEAD
### 2. Install dependencies
=======
### 2. Install Dependencies
>>>>>>> 6c614db (Improve project README formatting)

```bash
npm install
```

<<<<<<< HEAD
### 3. Configure environment variables

Create a `.env` file in the project root and add your own database credentials and JWT secret:
=======
### 3. Configure Environment Variables

Create a `.env` file in the project root and add your own database credentials and JWT secret.
>>>>>>> 6c614db (Improve project README formatting)

```env
PORT=5000
TIDB_HOST=your_tidb_host
TIDB_PORT=4000
TIDB_USER=your_tidb_user
TIDB_PASSWORD=your_tidb_password
TIDB_DATABASE=ewu_campus_maintenance
TIDB_ENABLE_SSL=true
JWT_SECRET=your_jwt_secret
```

<<<<<<< HEAD
### 4. Start the backend
=======
### 4. Start the Backend
>>>>>>> 6c614db (Improve project README formatting)

```bash
npm start
```

The backend will run at:

`http://localhost:5000`

## Future Improvements

- Improve user interface and accessibility.
- Add more reporting and monitoring features.
- Enhance complaint analytics and management.

---

<<<<<<< HEAD
**Project:** Campus Maintenance & Facility Issue Reporting System
**Status:** Deployed — Under Development
**GitHub:** [https://github.com/Tahsin-Jawad/Campus-Maintenance](https://github.com/Tahsin-Jawad/Campus-Maintenance)
**Live Demo:** [https://campus-maintenance.pages.dev](https://campus-maintenance.pages.dev)
=======
**University:** East West University  
**Project Status:** Deployed — Under Development  
**Live Demo:** [campus-maintenance.pages.dev](https://campus-maintenance.pages.dev)  
**GitHub:** [Tahsin-Jawad/Campus-Maintenance](https://github.com/Tahsin-Jawad/Campus-Maintenance)
>>>>>>> 6c614db (Improve project README formatting)
