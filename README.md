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
- **JWT + bcrypt** for authentication
- **Role-based access control** (RBAC) system

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
   
   # Backend (http://localhost:5000)
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

## Project Structure

```
website/
├── frontend/           # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # Express.js API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── docs/              # Development documentation
└── README.md
```

## Features

### Phase 1 (Current)
- ✅ Project setup with React + Express + PostgreSQL
- ✅ Brand identity implementation with Tailwind CSS
- ✅ Database schema with user management and RBAC
- ✅ Basic homepage with professional design

### Phase 2 (Planned)
- Public website pages (services, about, contact)
- Content management system for blog posts
- Case study templates and management

### Phase 3 (Planned)  
- User registration and authentication
- Role-based access control
- Administrative panel

## Database Schema

Key entities:
- **Users** - User accounts with authentication
- **Roles** - Role definitions (admin, subscriber, client, user)
- **Permissions** - Granular permissions for RBAC
- **BlogPosts** - Content management for blog
- **CaseStudies** - Portfolio project showcases
- **Resources** - Downloadable content library

## Security

- JWT-based authentication with refresh tokens
- bcrypt password hashing
- Rate limiting and security headers
- Audit logging for user actions
- Role-based access control (RBAC)

## Contributing

This is a private project for RippleWorks. For development questions or issues, contact the development team.

## License

Private - All rights reserved.