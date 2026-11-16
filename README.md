# EWU Campus Maintenance & Facility Issue Reporting System

A web-based system to report and manage maintenance problems at East West University (EWU).

## 1. About the Project

The EWU Campus Maintenance System is designed to make campus maintenance easier, faster, and more organized.

Students and faculty members can report problems in different areas of the university. Admins can manage complaints and assign them to maintenance staff.

## 2. Why Did We Choose This Project?

Every university campus faces different internal problems, such as:

- Broken chairs and tables.
- Air conditioning problems.
- Electrical issues.
- Projector and computer problems.
- Internet and network issues.
- Washroom and other facility problems.

At EWU, students often face these problems but may not know where or how to report them. Sometimes, complaints do not get proper attention from the responsible authority. There is also no easy way to track whether a reported problem has been solved.

We chose this project to create a simple platform where campus problems can be reported, managed, and tracked properly.

## 3. Our Solution

Our system provides a central platform for reporting and managing campus maintenance issues.

1. Students and faculty members submit complaints.
2. Complaints are stored in the database.
3. Admins review and assign complaints to maintenance staff.
4. Staff members work on assigned issues and update their status.
5. Users can track their complaints and check their progress.

This process helps make complaint management more organized and transparent.

## 4. Main Features

- User Registration and Login
- Role-Based Access
- Complaint Submission
- Complaint Tracking
- Complaint History
- Admin Dashboard
- Maintenance Staff Dashboard
- Complaint Assignment
- Status Updates
- User Feedback System

## 5. User Roles

| Role | Responsibilities |
|---|---|
| Student | Submit complaints and track progress |
| Faculty | Report campus problems |
| Admin | Manage complaints and assign staff |
| Maintenance Staff | Handle assigned complaints and update status |

## 6. Database Design

We use **MySQL** as our database management system.

Database Name: `ewu_campus_maintenance`

Our database contains 9 tables:

| Table | Purpose |
|---|---|
| roles | Stores user roles |
| users | Stores user information |
| locations | Stores campus locations |
| categories | Stores complaint categories |
| statuses | Stores complaint statuses |
| complaints | Stores complaint details |
| staff_assignments | Stores staff assignments |
| complaint_history | Stores complaint history |
| feedback | Stores user feedback |

These tables are connected through Primary Keys and Foreign Keys to maintain relationships and data integrity.

## 7. Database Connection

Our system uses **Node.js and Express.js** for backend operations and **MySQL** for data storage.

We use the `mysql2` package to connect the backend with the database.

The process works like this:

1. The frontend sends a request to the backend.
2. The backend processes the request.
3. The backend communicates with MySQL.
4. MySQL stores or retrieves the required information.
5. The result is sent back to the frontend.

For example, when a student submits a complaint, the backend stores the complaint information in the database and connects it with the relevant user, location, category, and status.

## 8. Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Token (JWT)
- **Password Security:** bcrypt
- **Database Connection:** mysql2
- **Tools:** VS Code, XAMPP, phpMyAdmin
- **Version Control:** Git and GitHub

## 9. Future Plans

- Launch the system online.
- Improve the user interface.
- Add more useful features.

---

**Project:** EWU Campus Maintenance & Facility Issue Reporting System

**University:** East West University

**Status:** Under Development

**GitHub:** https://github.com/Tahsin-Jawad/Campus-Maintenance


