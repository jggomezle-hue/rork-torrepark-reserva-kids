# TORREPARK Reserva Kids

## Overview

TORREPARK Reserva Kids is a cross-platform mobile application for managing children's play area bookings at a recreational facility in Torre del Mar, Spain. The application enables parents to reserve time slots for their children and sends automatic email confirmations to administrators via MailerSend. Built with Expo Router and React Native for the frontend, and Hono with tRPC for the backend API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo Router (v53+)
- **Routing**: File-based routing using Expo Router with typed routes
- **State Management**: React Context API (BookingContext) for booking state and form data management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **API Communication**: tRPC React client with HTTP links and SuperJSON transformation
- **Styling**: NativeWind (Tailwind for React Native) with custom color constants
- **Cross-Platform**: Native iOS & Android apps with web export capability
- **UI Components**: Lucide React Native icons, Expo Linear Gradient, custom styled components

**Navigation Structure**:
- Tab-based navigation with two main screens:
  - Home (`index.tsx`) - Welcome screen with facility information
  - Booking (`booking.tsx`) - Reservation form with date/time pickers

**Form Handling**:
- Platform-specific date/time pickers (native pickers on iOS/Android, HTML input on web)
- Real-time form validation using Zod schemas
- Loading states and error handling for submission

### Backend Architecture

**Framework**: Hono (lightweight web framework)
- **Server Runtime**: Bun
- **API Pattern**: Dual approach - tRPC for type-safe procedures and REST endpoints for email sending
- **Type Safety**: End-to-end type safety with tRPC and Zod validation
- **Data Transformation**: SuperJSON for serializing complex types (dates, etc.)
- **CORS**: Configured to allow all origins for cross-platform access

**API Structure**:
- **REST Endpoint**: `POST /api/booking/send-email` - Direct email sending endpoint
- **tRPC Router**: 
  - `example.hi` - Example mutation demonstrating tRPC setup
  - `booking.sendEmail` - Type-safe email sending procedure (alternative to REST)
- **Health Check**: `GET /` - API status endpoint

**Request Flow**:
1. Client submits booking form
2. Data validated against Zod schema on both client and server
3. REST endpoint receives POST request with booking details
4. Server calls MailerSend API with template and variables
5. Email sent to configured admin address
6. Success/error response returned to client

### Data Storage

**Current State**: No persistent database
- Bookings are temporarily stored in React Context state
- Each booking generates a timestamp-based ID
- Data is lost on app reload (suitable for demo/prototype phase)

**Future Consideration**: 
- Architecture supports adding Drizzle ORM for database persistence
- Schema would likely include: bookings table with fields matching current Booking interface

### Authentication & Authorization

**Current State**: No authentication implemented
- Public access to all features
- No user accounts or login system
- Suitable for single-location, admin-managed booking system

### Email System

**Provider**: MailerSend
- **Template-Based**: Uses pre-configured HTML email template (ID: jpzkmgqyj5ml059v)
- **Domain**: test-pzkmgq7x6v2l059v.mlsender.net
- **Recipient**: Fixed admin email (jggomezle@gmail.com)
- **Authentication**: API token stored in environment variable `MAILERSEND_API_TOKEN`

**Email Template Variables**:
- `booking_date` - Reservation date
- `booking_time` - Time slot
- `number_of_kids` - Number of children
- `parent_name` - Parent/guardian name
- `parent_email` - Contact email
- `parent_phone` - Contact phone
- `notes` - Additional notes (optional)

**Email Flow**:
1. Form submission triggers email send
2. Booking data formatted for template variables
3. HTTP POST to MailerSend API (https://api.mailersend.com/v1/email)
4. Template rendered with substitutions
5. Email delivered to admin inbox

### Environment Configuration

**Required Environment Variables**:
- `MAILERSEND_API_TOKEN` - MailerSend API authentication token
- `PORT` - Server port (defaults to 5000)
- `EXPO_PUBLIC_RORK_API_BASE_URL` - Backend API URL for production
- `EXPO_PUBLIC_TOOLKIT_URL` - Alternative API URL detection

**URL Resolution Strategy** (in order of precedence):
1. `EXPO_PUBLIC_RORK_API_BASE_URL` environment variable
2. Derived from `EXPO_PUBLIC_TOOLKIT_URL`
3. `window.location.origin` (web platform)
4. Expo hostUri (development)
5. Platform-specific localhost (Android: 10.0.2.2, iOS: localhost)

## External Dependencies

### Third-Party Services

**MailerSend Email Service**:
- **Purpose**: Transactional email delivery for booking confirmations
- **Plan**: Free tier (3,000 emails/month)
- **Features Used**: Template-based emails, variable substitution
- **API Endpoint**: https://api.mailersend.com/v1/email
- **Documentation**: Configured in `constants/emailConfig.ts`

**Rork Platform**:
- **Purpose**: AI-powered mobile app builder and hosting
- **Integration**: App managed through Rork dashboard with GitHub sync
- **Project ID**: pyl2a4ugyfrqlx6mp2ct1

**Replit Deployment**:
- **Purpose**: Backend hosting
- **Domain**: rork-torrepark-reserva-kids-vmc2.replit.app
- **Features**: Autoscale deployment, environment secrets management

### NPM Packages

**Core Framework**:
- `expo` (v53.0.4) - Cross-platform app framework
- `expo-router` (v5.0.3) - File-based navigation
- `react-native` (v0.79.1) - Native mobile framework
- `hono` (v4.10.1) - Lightweight web framework
- `@hono/node-server` - Node.js adapter for Hono

**API & Data**:
- `@trpc/server`, `@trpc/client`, `@trpc/react-query` (v11.6.0) - Type-safe API layer
- `@tanstack/react-query` (v5.90.5) - Server state management
- `zod` - Schema validation
- `superjson` - Advanced serialization

**UI & UX**:
- `lucide-react-native` (v0.475.0) - Icon library
- `expo-linear-gradient` (v14.1.4) - Gradient components
- `@react-native-community/datetimepicker` (v8.4.1) - Native date/time pickers
- `nativewind` (v4.1.23) - Tailwind CSS for React Native

**Utilities**:
- `@react-native-async-storage/async-storage` - Local storage
- `@nkzw/create-context-hook` - Context hook creator
- Expo SDK modules: constants, linking, haptics, image, etc.

### Development Tools

- **Runtime**: Bun (JavaScript runtime and package manager)
- **TypeScript**: Strict mode enabled with path aliases (`@/*`)
- **Linting**: ESLint with Expo config
- **Version Control**: Git with GitHub integration