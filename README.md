# Finance Tracker

Full-stack personal finance management application for tracking income, expenses, and financial activity through a centralized dashboard.

## Overview

Finance Tracker is a full-stack web application that helps users manage personal finances by recording income and expense transactions, monitoring financial activity, and viewing real-time summaries.

The application provides a secure authentication system, transaction categorization, financial analytics, and persistent storage to help users maintain organized financial records.

This project was built to strengthen full-stack development skills, REST API design, database management, authentication, and dashboard development.

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Authentication

* JWT Authentication

### Development Tools

* Git
* Postman
* dotenv

### DevOps

* Docker
* Docker Compose

## Core Features

* Secure user authentication using JWT
* Income and expense transaction management
* Category-based transaction organization
* Transaction filtering and sorting
* Real-time financial summaries
* Dashboard for tracking income, expenses, and balance
* Persistent transaction history
* RESTful API integration between frontend and backend
* Containerized deployment using Docker

## System Workflow

User Login → Add Transaction → Store in Database → Update Dashboard → View Financial Insights

## Project Structure

```text
finance-tracker/
├── client/              # React frontend
├── server/              # Express backend APIs
└── database_schema.sql  # MySQL database schema
```

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/krishfr/finance-tracker-.git
cd finance-tracker-
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Configure Environment Variables

```bash
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=finance_tracker
JWT_SECRET=your_secret_key
```

### Run Application

```bash
docker-compose up
```

## Access Application

```bash
http://localhost:3000
```

## Use Cases

* Personal finance management
* Income and expense tracking
* Budget monitoring
* Financial record keeping
* Small business expense tracking

## Key Learnings

* Building secure authentication systems with JWT
* Designing RESTful APIs using Express.js
* Managing relational data with MySQL
* Creating dynamic dashboards using React.js
* Implementing transaction filtering and financial analytics
* Connecting frontend, backend, and database layers
* Containerizing applications using Docker

## Future Enhancements

* Budget planning and spending goals
* Recurring transaction management
* Data export to PDF and Excel
* Email notifications and reminders
* AWS cloud deployment

## Author

**Krish Chaudhari**


