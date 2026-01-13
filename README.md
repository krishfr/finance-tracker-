# Finance Tracker Web Application

## Overview
A comprehensive full-stack web application designed for secure transaction management and financial record keeping. This system enables users to efficiently record income and expense transactions, access real-time financial summaries, and maintain persistent transaction histories with enterprise-grade security.

## Key Features
- **Secure Authentication**: JWT-based authentication system with token-based access control
- **Transaction Management**: Create, read, update, and delete financial records with ease
- **Dashboard Analytics**: Real-time visualization of income and expense data
- **RESTful API Architecture**: Standardized backend endpoints for seamless client-server communication
- **Data Persistence**: PostgreSQL database for reliable and scalable data storage
- **Environment Configuration**: Flexible deployment through environment variable management

## Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, JavaScript, HTML5, CSS3 |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JSON Web Tokens (JWT) |
| Development Tools | Git, Postman, dotenv |

## Project Structure
```
finance-tracker/
├── client/              # React frontend application
├── server/              # Express.js backend and API endpoints
└── database_schema.sql  # MySQL schema definition
```

## Installation & Setup
1. Clone the repository to your local environment
2. Configure environment variables by creating a `.env` file (reference: `.env.example`)
3. Update PostgreSQL database credentials in the configuration file
4. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
5. Initialize the database using `database_schema.sql`
6. Start both development servers according to project documentation

## Use Cases
- Track daily financial transactions with detailed categorization
- Maintain comprehensive transaction history for financial analysis
- Generate financial summaries for personal or business accounting
- Monitor income and expense patterns over time

## Author
Krish Chaudhari
