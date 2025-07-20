# RippleWorks Website

Professional technology consulting website for small business IT modernization.

## Overview

RippleWorks is a technology consultancy specializing in:
- Network consulting and infrastructure optimization
- Website development and maintenance
- Cloud migration and server management
- Technical training and documentation

## Technology Stack

### Frontend
- **React** with Vite for fast development
- **Tailwind CSS** for styling with custom RippleWorks brand colors
- **JavaScript** (planned migration to TypeScript)

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Prisma ORM
- **JWT + bcrypt** for authentication and password hashing
- **Role-based access control** (RBAC) system
- **ElasticMail SMTP** for email verification and password reset
- **Nodemailer** for email service management

### Infrastructure
- **Cloudways VPS** hosting
- **Git** version control with GitHub

## Brand Colors

- **Primary Orange:** #FF6A00
- **Deep Purple:** #2C144D  
- **White:** #FFFFFF
- **Charcoal:** #1C1C1C

## Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn
- SMTP credentials (ElasticMail for production or console logging for development)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. Environment setup:
   ```bash
   # Copy environment template
   cp backend/.env.example backend/.env
   # Edit .env with your database URL and secrets
   ```

4. Database setup:
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. Start development servers:
   ```bash
   # Frontend (http://localhost:5173)
   cd frontend
   npm run dev
   
   # Backend (http://localhost:3001)
   cd backend
   npm run dev
   ```

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:reset` - Reset database
- `npm run setup:auth` - Setup initial roles and admin user

## Project Structure

```
website/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── admin/     # Admin panel components
│   │   │   ├── auth/      # Authentication components
│   │   │   └── user/      # User-specific components
│   │   ├── contexts/      # React Context providers
│   │   ├── pages/         # Page components and routes
│   │   │   └── admin/     # Admin panel pages
│   │   └── utils/         # Utility functions and API calls
│   ├── public/
│   └── package.json
├── backend/            # Express.js API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Business logic services
│   │   ├── scripts/       # Database and setup scripts
│   │   └── utils/         # Backend utilities
│   ├── prisma/           # Database schema and migrations
│   └── package.json
├── docs/              # Development documentation
└── README.md
```

## Features

### Phase 1 (Completed)
- ✅ Project setup with React + Express + PostgreSQL
- ✅ Brand identity implementation with Tailwind CSS
- ✅ Database schema with user management and RBAC
- ✅ Basic homepage with professional design

### Phase 2 (Completed)
- ✅ Public website pages (services, about, contact)
- ✅ Content management system for blog posts
- ✅ Case study templates and management

### Phase 3 (Completed)  
- ✅ Complete JWT-based authentication system
- ✅ User registration with email verification
- ✅ Password reset functionality via email
- ✅ Role-based access control with protected routes
- ✅ User dashboard with profile management
- ✅ Administrative panel with content management
- ✅ Email service integration (ElasticMail + development mode)

### Phase 4 (Planned)
- Advanced admin features and analytics
- Enhanced content management capabilities
- Performance optimization and caching
- SEO improvements and meta tag management

## Database Schema

Key entities:
- **Users** - User accounts with authentication and email verification
- **Roles** - Role definitions (admin, subscriber, client, user)
- **Permissions** - Granular permissions for RBAC
- **UserRoles** - Many-to-many relationship between users and roles
- **BlogPosts** - Content management for blog with SEO fields
- **CaseStudies** - Portfolio project showcases
- **Resources** - Downloadable content library with access levels
- **AuditLogs** - Security audit trail for user actions

## Security

- JWT-based authentication with 7-day token expiration
- bcrypt password hashing with 12 salt rounds
- Email verification with 24-hour token expiry
- Password reset with 1-hour secure token expiry
- Role-based access control (RBAC) with route protection
- Audit logging for user actions and security events
- Environment-based email service (development vs production)

## Contributing

This is a private project for RippleWorks. For development questions or issues, contact the development team.

## License

Private - All rights reserved.