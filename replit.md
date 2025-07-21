# Notre Dame de la Tronchaye Sanctuary Website

## Overview

This is a full-stack web application for the Sanctuary of Notre Dame de la Tronchaye in Rochefort en Terre, France. The application provides information about the sanctuary's history, events, services, and allows visitors to contact the sanctuary and view a gallery of photos. It includes an admin panel for managing content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter (lightweight React Router alternative)
- **UI Components**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React Context for app state
- **Internationalization**: react-i18next for multi-language support (French, English, German)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Style**: RESTful API with JSON responses
- **Authentication**: Session-based auth using Passport.js with local strategy
- **File Uploads**: Multer for handling image uploads
- **Email Service**: SendGrid for contact form notifications
- **Security**: bcrypt for password hashing, CORS enabled

### Database Architecture
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Schema Validation**: Zod for runtime type checking
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Data Models
- **Users**: Admin authentication with username/password
- **Events**: Regular events with dates, times, descriptions, and images
- **Special Events**: Recurring religious events (masses, special occasions)
- **Photos**: Gallery images with titles and URLs
- **Contact Messages**: Form submissions from visitors
- **Subscribers**: Newsletter email subscriptions

### Authentication System
- Session-based authentication using express-session
- Protected admin routes requiring login
- Password hashing with bcrypt
- Automatic session management and persistence

### File Upload System
- Image upload functionality for gallery and event photos
- File size limits (5MB) and type validation (images only)
- Memory storage with multer (files stored temporarily)

### Email Integration
- SendGrid integration for contact form notifications
- Multiple contact subjects (information, baptism, marriage, mass requests, visits)
- Automated email sending with error handling

## Data Flow

1. **Client Requests**: React frontend makes API calls using TanStack Query
2. **Authentication**: Protected routes check session status via middleware
3. **Database Operations**: Express routes use Drizzle ORM to interact with PostgreSQL
4. **File Handling**: Multer processes uploaded images before storage
5. **Email Processing**: Contact forms trigger SendGrid email notifications
6. **Response Handling**: JSON responses with proper error handling and validation

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@sendgrid/mail**: Email service for contact forms
- **@radix-ui/***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Database ORM and query builder
- **express**: Web server framework
- **passport**: Authentication middleware
- **bcrypt**: Password hashing
- **multer**: File upload handling
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tailwindcss**: CSS framework
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from public directory

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SENDGRID_API_KEY`: Email service API key
- `SESSION_SECRET`: Session encryption key (recommended for production)

### Scripts
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm start`: Start production server
- `npm run db:push`: Apply database schema changes

### Database Setup
- Uses Drizzle migrations in `/migrations` directory
- Schema defined in `/shared/schema.ts`
- Automatic admin user creation endpoint for initial setup

The application is designed to be deployed on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases.