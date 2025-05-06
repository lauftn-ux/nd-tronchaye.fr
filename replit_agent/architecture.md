# Architecture Overview

## Overview

This application is a full-stack web application for the Sanctuary of Notre Dame de la Tronchaye, providing information about events, history, and services offered by the sanctuary. The application follows a modern web architecture with a clear separation between frontend and backend components.

The system is built using a Node.js/Express backend with React frontend, following a RESTful API pattern for communication between the client and server. The application uses PostgreSQL (via Neon serverless) for data persistence, managed through Drizzle ORM.

## System Architecture

The application follows a client-server architecture with the following key components:

### Frontend

- **Technology**: React with TypeScript
- **UI Framework**: Custom components built with Radix UI primitives and styled with Tailwind CSS
- **State Management**: React Query for server state, React Context for application state
- **Routing**: Wouter (lightweight alternative to React Router)
- **Build Tool**: Vite

### Backend

- **Technology**: Node.js with Express
- **API Style**: RESTful API
- **Authentication**: Session-based authentication using Passport.js
- **Database Access**: Drizzle ORM with PostgreSQL
- **File Storage**: Local storage with multer for file uploads

### Database

- **Type**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle with schema validation using Zod
- **Schema**: Structured around users, events, photos, contact messages, and other domain-specific entities

## Key Components

### Client Components

1. **Pages**:
   - Home, Events, Calendar, History, Gallery, Admin sections
   - Authentication-protected admin routes

2. **UI Components**:
   - Built using Radix UI primitives for accessibility
   - Styled with Tailwind CSS for responsive design
   - Shadcn-inspired component library

3. **State Management**:
   - TanStack Query for server state management and caching
   - React Context for language, auth, and other application state

### Server Components

1. **API Routes**:
   - RESTful endpoints for CRUD operations on various entities
   - Authentication endpoints for user login/logout
   - Admin-only protected routes

2. **Authentication**:
   - Session-based authentication with Passport.js
   - bcrypt for password hashing
   - Role-based access control (admin vs regular users)

3. **Storage Services**:
   - Database service for data persistence
   - File upload handling with multer

### Database Schema

The database schema includes the following key tables:

1. **users**: Authentication and user management
   - Stores user credentials and admin status

2. **events**: Church events
   - Stores event details, dates, and image references

3. **photos**: Image gallery
   - Manages photo records for the gallery section

4. **contact_messages**: User communications
   - Stores messages sent through the contact form

## Data Flow

1. **User Interaction Flow**:
   - Client requests are processed through React components
   - API requests are made using React Query
   - Responses update the UI state

2. **Authentication Flow**:
   - Credentials submitted through login form
   - Server authenticates and establishes session
   - Session token stored in cookies
   - Protected routes check session validity

3. **Data Persistence Flow**:
   - API endpoints receive data from client
   - Data validated using Zod schemas
   - Drizzle ORM manages database operations
   - Results returned to client as JSON

4. **Image Upload Flow**:
   - Files uploaded via multer middleware
   - Files processed and stored
   - References saved in database

## External Dependencies

### Frontend Dependencies

- **@radix-ui components**: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **@tanstack/react-query**: Data fetching and state management
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **i18next**: Internationalization

### Backend Dependencies

- **express**: Web server framework
- **passport**: Authentication middleware
- **bcrypt**: Password hashing
- **drizzle-orm**: Database ORM
- **multer**: File upload handling
- **@neondatabase/serverless**: PostgreSQL client for Neon

## Deployment Strategy

The application is configured for deployment on Replit with the following configuration:

1. **Build Process**:
   - Frontend built using Vite
   - Backend bundled using esbuild
   - Combined into a single distributable package

2. **Runtime Environment**:
   - Node.js 20
   - PostgreSQL 16
   - Web server

3. **Configuration**:
   - Environment variables for database connection and other settings
   - Production vs. development configurations

4. **Database**:
   - Neon serverless PostgreSQL
   - Connected via environment variable DATABASE_URL

5. **Scaling**:
   - Configured for autoscaling on Replit

## Security Considerations

1. **Authentication**:
   - Password hashing with bcrypt
   - Session-based authentication
   - CSRF protection through same-site cookies

2. **Authorization**:
   - Role-based access control for admin features
   - Protected API routes

3. **Data Validation**:
   - Input validation using Zod schemas
   - Content-type verification for uploads

## Development Workflow

1. **Local Development**:
   - `npm run dev` starts development server with hot reloading
   - Vite provides fast frontend development experience

2. **Database Schema Management**:
   - Drizzle Kit for schema migration and management
   - `npm run db:push` to update schema

3. **Type Safety**:
   - TypeScript throughout the codebase
   - Shared types between frontend and backend
   - Schema validation with Zod

4. **Production Build**:
   - `npm run build` creates optimized production build
   - `npm run start` runs the production server