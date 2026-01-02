# HEMIS Frontend – Multi-Tenant Campus Management System

## Overview

HEMIS Frontend is a modern, scalable web application designed to manage the complete operational modules of an educational campus.  
It follows a **multi-tenant architecture**, where multiple campuses run on the same frontend codebase while maintaining isolated configurations and data.
The application dynamically resolves campus configuration **at runtime**, without relying on environment (`.env`) files.

---

## Campus Modules

The system manages the following campus modules:

- Accounts Management
- Examination Management
- Library Management
- Student Enrollment
- Employee Management
- Graduation Management
- Pass Rate Management
- Dashboard & Analytical Reports

---

## Tech Stack

### Core
- React
- Vite

### State & Data Management
- Redux Toolkit (RTK)
- React Query

### UI & Styling
- Material UI (MUI)
- Tailwind CSS
- Mantine

---

## Installation & Setup

### Prerequisites
- Node.js >= 18
- npm or yarn

### Install Dependencies

```bash
git clone <repository-url>
cd hemis-frontend
npm install
