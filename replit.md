# Ink Coverage Estimator - Professional Document Analysis Tool

## Overview

This is a professional web application designed for print shops and mass printing centers to analyze ink coverage in documents. The application provides CMYK (Cyan, Magenta, Yellow, Black) ink usage analysis for various document formats including PDF, EPS, Excel, images, and other printable documents. Built with modern web technologies, it offers a complete solution for cost estimation and print optimization.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript for full-stack type safety
- **File Processing**: Multer for file upload handling with support for multiple document formats
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Definition**: Centralized schema in `/shared/schema.ts` for consistency
- **File Storage**: Local file system storage in `/uploads` directory
- **Database Migrations**: Drizzle Kit for schema migrations

## Key Components

### Document Management System
- **Upload Processing**: Multi-format document upload with validation
- **File Types Supported**: PDF, EPS, Excel, Word, images (JPEG, PNG, TIFF, GIF)
- **Size Limits**: 50MB maximum file size per document
- **Storage**: Secure file storage with original filename preservation

### Analysis Engine
- **Mock Implementation**: Current implementation includes mock analysis functionality
- **CMYK Processing**: Calculates coverage percentages for each ink color
- **Page-by-Page Analysis**: Detailed breakdown for multi-page documents
- **Status Tracking**: Real-time analysis status (pending, processing, completed, failed)

### User Interface Components
- **File Upload**: Drag-and-drop interface with progress tracking
- **Analysis Results**: Real-time display of ink coverage data
- **Report Generation**: Export capabilities for PDF, Excel, and image formats
- **Professional Design**: Business-focused UI with CMYK color scheme

### API Structure
- **RESTful Endpoints**: 
  - `POST /api/documents/upload` - File upload
  - `POST /api/documents/:id/analyze` - Start analysis
  - `GET /api/analyses/:id` - Get analysis results
  - `GET /api/analyses/:id/download/:format` - Download reports

## Data Flow

1. **Document Upload**: User uploads document through drag-and-drop interface
2. **File Validation**: Server validates file type, size, and format
3. **Storage**: Document stored in file system with metadata in database
4. **Analysis Trigger**: User initiates analysis for uploaded document
5. **Processing**: Mock analysis engine calculates CMYK coverage
6. **Results Display**: Real-time updates show analysis progress and results
7. **Report Generation**: Users can export detailed reports in multiple formats

## External Dependencies

### Core Libraries
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` and `drizzle-zod` for database operations
- **UI Components**: Extensive Radix UI component collection via shadcn/ui
- **File Processing**: `multer` for file uploads
- **Validation**: Zod for runtime type validation

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full-stack type safety
- **ESBuild**: Server bundling for production
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Replit Configuration
- **Platform**: Configured for Replit deployment with autoscale target
- **Build Process**: `npm run build` for production assets
- **Runtime**: Node.js 20 with PostgreSQL 16 module
- **Port Configuration**: Server runs on port 5000, exposed as port 80

### Environment Setup
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable
- **File Storage**: Local uploads directory with proper permissions
- **Sessions**: PostgreSQL-backed session storage for scalability

### Production Considerations
- **Asset Serving**: Static files served from `/dist/public`
- **Error Handling**: Comprehensive error boundaries and API error responses
- **Logging**: Request/response logging for API endpoints
- **Performance**: Optimized builds with tree shaking and code splitting

## Changelog

```
Changelog:
- June 24, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```