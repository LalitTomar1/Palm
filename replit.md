# PalmWise - AI-Powered Palm Reading Application

## Overview

PalmWise is a modern full-stack web application that provides AI-powered palm reading services. Users can upload photos of their palms and receive detailed mystical interpretations powered by a local AI system. The application combines traditional palmistry wisdom with modern technology to deliver personalized insights about personality traits, relationships, and life paths. The system uses a seeded randomization approach to provide consistent yet varied readings based on image characteristics, eliminating the need for external AI API keys while maintaining an authentic palm reading experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the overhead of React Router
- **State Management**: TanStack React Query for efficient server state management, caching, and data synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom mystical theme variables, cosmic gradients, and responsive design patterns
- **Build Tool**: Vite for fast development builds and optimized production bundles with hot module replacement

The frontend follows a page-based architecture with dedicated components for upload interface, analysis progress tracking, and results display. The mystical theme uses custom CSS variables for consistent branding across purple and golden color schemes.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features and type safety
- **API Design**: RESTful endpoints following `/api/*` patterns for palm reading operations
- **File Handling**: Multer middleware for multipart form data processing and image uploads with size limits
- **Session Management**: Express middleware with request/response logging for development debugging
- **Development**: Integrated with Vite for seamless full-stack development experience

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations and schema management
- **ORM Features**: Drizzle provides zero-runtime overhead with compile-time type safety
- **Schema Management**: Drizzle Kit handles migrations and schema generation from TypeScript definitions
- **Development Storage**: In-memory storage implementation (MemStorage class) for rapid development and testing
- **Production Storage**: Neon Database serverless PostgreSQL for scalable cloud deployment

The storage architecture uses a repository pattern with an IStorage interface, allowing easy switching between memory-based development storage and PostgreSQL production storage.

### Authentication and Authorization
- **Session Management**: Express sessions prepared with PostgreSQL session store using connect-pg-simple
- **User Schema**: Basic username/password authentication structure defined in schema
- **Security Framework**: Bcrypt integration ready for password hashing (implementation pending)
- **Session Storage**: PostgreSQL-backed sessions for production scalability

### AI Analysis System
- **Local Processing**: Custom palm reading analysis system that generates personalized interpretations without external API dependencies
- **Image Processing**: Base64 image encoding with hash-based seeding for consistent results
- **Seeded Randomization**: Uses image characteristics to generate reproducible yet varied readings
- **Analysis Structure**: Comprehensive palm analysis covering life line, heart line, head line, fate line, and special features
- **Processing Simulation**: Realistic timing delays to enhance user experience during analysis

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting optimized for modern applications
- **Connection Pooling**: Neon's built-in connection management for efficient database operations
- **WebSocket Support**: Neon serverless driver with WebSocket constructor for real-time capabilities

### Development Tools
- **Replit Integration**: Custom Vite plugins including runtime error modal and cartographer for enhanced development experience
- **Build Pipeline**: ESBuild for server-side bundling with external package handling
- **TypeScript Compilation**: Incremental compilation with strict type checking and modern ES module support

### UI and Styling Libraries
- **Radix UI**: Comprehensive set of accessible React components as foundation for custom UI
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for mystical theming
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

### Form and Data Handling
- **React Hook Form**: Form management with validation using Zod schema validation
- **Drizzle Zod**: Integration between Drizzle ORM and Zod for runtime type validation
- **Date-fns**: Date manipulation and formatting utilities for timestamp handling