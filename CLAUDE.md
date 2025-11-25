# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WebMonitor is a web content monitoring and notification system that provides real-time monitoring of webpage content changes with multi-channel notification support.

### Current Architecture
- **Early Version**: Pure Python scripts (functional, available in `EarlyScripts/`)
- **New Version**: React JavaScript frontend + FastAPI + Python backend + SQLite (default)/PostgreSQL (production)

## Development Commands

### Running the Full Application
```bash
# Terminal 1: Start backend
cd backend
python main.py  # or: uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start frontend
cd frontend
npm start

# Access points:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# Health check: http://localhost:8000/health
```

### Early Scripts Version (Functional Legacy)
```bash
cd EarlyScripts
pip install -r ../requirements.txt
vim .env  # Configure email settings
python main.py
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python main.py  # Built-in dev mode with auto-restart
# OR
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Database: SQLite (dev) or PostgreSQL (prod via DATABASE_URL)
# Auto-creates admin user: admin/admin123 (change on first login)
```

### Frontend Development
```bash
cd frontend
npm install
npm start          # Dev server on http://localhost:3000
npm run build      # Production build
npm test           # Run tests (Jest + React Testing Library)
npm test -- --coverage    # Run tests with coverage report
npm test -- --watch       # Watch mode for development

# Proxy configured to http://localhost:8000 for API calls
# ESLint configured with react-app rules
```

### Key Dependencies
**Backend** (`backend/requirements.txt`):
- fastapi==0.104.1 (web framework)
- uvicorn[standard]==0.24.0 (ASGI server)
- sqlalchemy==2.0.23 (ORM)
- selenium==4.15.2 (web scraping)
- apscheduler==3.10.4 (task scheduling)
- pydantic==2.5.0 (data validation)
- python-jose[cryptography]==3.3.0 (JWT auth)
- passlib[bcrypt]==1.7.4 (password hashing)

**Frontend** (`frontend/package.json`):
- React 18.2.0 (UI framework)
- Material-UI 5.15.0 (component library)
- React Router 6.20.1 (routing)
- React Query 3.39.3 (server state)
- Axios 1.6.2 (HTTP client)
- Day.js 1.11.10 (date handling)

## Architecture & Code Structure

### Application Flow
1. **Backend Startup** (`backend/main.py`): Creates database tables, default admin user, starts monitoring scheduler
2. **Frontend**: React SPA with Material-UI, authentication context, protected routes
3. **API Layer**: FastAPI with JWT authentication, CORS, automatic docs
4. **Monitoring**: APScheduler schedules Selenium WebDriver tasks
5. **Database**: SQLAlchemy ORM with SQLite (dev) / PostgreSQL (prod)

### Backend (`backend/`)

**Entry Point & Lifecycle**
- **`main.py`**: FastAPI app with lifespan management - creates admin user, starts scheduler
- **`app/core/config.py`**: Pydantic settings with .env support (database, SMTP, JWT, monitoring)

**API Layer** (`app/api/`)
- **`routes.py`**: Main CRUD endpoints for monitor tasks, logs, email configs, blacklist, subscriptions
- **`auth.py`**: Authentication endpoints (login, register, current user)
- JWT-based authentication with bcrypt password hashing

**Key API Endpoints**
- `GET/POST /api/auth/login` - User authentication
- `GET/POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user info
- `GET/POST /api/tasks/` - Monitor task CRUD operations
- `GET /api/tasks/{task_id}/logs` - Task monitoring logs
- `GET/POST /api/email-config/` - Email configuration management
- `GET/POST /api/blacklist/` - Domain blacklist management (admin)
- `GET/POST /api/subscriptions/` - Task subscription management
- Health check: `GET /health`

**Database Layer** (`app/db/`)
- **`models.py`**: SQLAlchemy models - User, MonitorTask, MonitorLog, EmailConfig, BlacklistDomain, TaskSubscription
- **`crud.py`**: Database operations with session management and complex queries
- **`database.py`**: Engine configuration, session factory

**Business Logic** (`app/services/`)
- **`monitor_service.py`**: Selenium WebDriver scraping with XPath selectors
- **`email_service.py`**: SMTP notifications with SSL/TLS support
- **`scheduler.py`**: APScheduler management for monitoring tasks
- **`auth_service.py`**: JWT token creation, password validation

**Data Validation** (`app/schemas/`)
- **`schemas.py`**: Pydantic models for API request/response validation

### Frontend (`frontend/`)

**Core Application**
- **`src/App.js`**: React Router setup, Material-UI theme, authentication provider
- **`src/index.js`**: Application entry point
- Chinese typography focus with serif fonts (Source Serif Pro, Noto Serif SC)

**Authentication & Routing**
- **`src/contexts/AuthContext.js`**: Global authentication state management
- **`src/components/ProtectedRoute.js`**: Route guards with admin-only support
- Public routes: `/`, `/login`, `/register`
- Protected routes: `/dashboard`, `/tasks`, `/logs`, `/email-config`
- Admin-only routes: `/user-management`, `/blacklist-management`

**Pages** (`src/pages/`)
- **`HomePage.js`**: Landing page with feature overview
- **`Dashboard.js`**: Overview with statistics cards and system metrics
- **`MonitorTasks.js`**: Task management with CRUD operations and visibility settings
- **`MonitorLogs.js`**: Log viewing with filtering and pagination
- **`EmailConfig.js`**: SMTP configuration management with test functionality
- **`UserManagement.js`**: Admin user management with role assignment
- **`BlacklistManagement.js`**: Admin domain blacklist management
- **`MySubscriptions.js`**: User task subscription management
- **`PublicTasks.js`**: Public task browsing and subscription
- **`Settings.js`**: User profile and application settings
- **`Login.js`**: User authentication page
- **`Register.js`**: New user registration page

**Components** (`src/components/`)
- **`Layout.js`**: Main app layout with navigation
- **`StatCard.js`**: Dashboard statistics display

**Technology Stack**
- **Material-UI 5.15.0**: Component library with X Data Grid for tables
- **React Query 3.39.3**: Server state management and caching
- **Axios 1.6.2**: HTTP client with API proxy to localhost:8000
- **Day.js 1.11.10**: Date/time manipulation
- **React Router 6.20.1**: Client-side routing

### Early Scripts (`EarlyScripts/`)
- **`main.py`**: Standalone Python monitoring script with Selenium and email notifications
- **`outlooknotice.py`**: SMTP email service for the legacy version
- Functional for simple use cases, lacks web interface

## Configuration

### Environment Variables (.env)
All configuration managed via `backend/app/core/config.py` with Pydantic settings:

**Database & Backend**
- `DATABASE_URL`: Database connection (default: `sqlite:///./webmonitor.db`)
- `DEBUG`: Enable debug mode (default: False)
- `LOG_LEVEL`: Logging level (default: INFO)
- `BACKEND_CORS_ORIGINS`: CORS origins (default: http://localhost:3000)

**Email & Notifications** (configure via web UI or environment)
- `SMTP_SERVER`: SMTP server address
- `SMTP_PORT`: SMTP port (default: 465)
- `SMTP_USER`: Sender email address
- `SMTP_PASSWORD`: SMTP password/app-specific password
- `RECEIVER_EMAIL`: Notification recipient email

**Monitoring Configuration**
- `DEFAULT_CHECK_INTERVAL`: Default interval in seconds (default: 300)
- `MAX_CHECK_INTERVAL`: Maximum interval (default: 86400)
- `MIN_CHECK_INTERVAL`: Minimum interval (default: 10)
- `SELENIUM_HEADLESS`: Run headless Chrome (default: True)
- `SELENIUM_TIMEOUT`: Selenium timeout in seconds (default: 30)

**Authentication**
- `SECRET_KEY`: JWT signing key (change in production)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiry (default: 30)

### Default Credentials
- **Admin User**: `admin` / `admin123` (created automatically, change on first login)

## Key Implementation Details

### Monitoring Engine
- **Selenium WebDriver**: Headless Chrome for dynamic content rendering
- **XPath Selectors**: Precise element targeting for content extraction
- **Change Detection**: String comparison with content hashing for efficiency
- **Error Handling**: Comprehensive error recovery and browser cleanup
- **Scheduling**: APScheduler with persistent job storage

### Authentication System
- **JWT-based**: Stateless authentication with configurable expiry
- **Role-based**: Regular users vs. admin users for privileged operations
- **Password Security**: Bcrypt hashing with automatic salt generation
- **Protected Routes**: Frontend route guards with API token validation

### Database Design
- **Users**: Authentication and authorization (admin flag, active status, email verification)
- **MonitorTasks**: URL, XPath selector, interval, last content, active status, visibility (public/private)
- **MonitorLogs**: All monitoring attempts with timestamps, results, error messages
- **EmailConfig**: SMTP settings with enable/disable flags
- **BlacklistDomain**: Domain blacklist for preventing monitoring of restricted sites
- **TaskSubscription**: User subscriptions to monitoring tasks with notification preferences

### Email Notifications
- **SMTP SSL/TLS**: Secure email delivery with multiple provider support
- **Unicode Support**: Proper UTF-8 encoding for international content
- **Template System**: Customizable email templates for change notifications
- **Debug Mode**: Configurable SMTP debugging for troubleshooting

## Development Guidelines

### Code Architecture Patterns
- **FastAPI**: Dependency injection for database sessions, services
- **SQLAlchemy**: ORM models with relationship definitions
- **Pydantic**: Request/response validation and settings management
- **React Context**: Global authentication state management
- **Material-UI**: Consistent design system with responsive layouts

### Security Best Practices
- Environment variables for sensitive data (SMTP credentials, JWT secrets)
- Password hashing with bcrypt (never store plain passwords)
- CORS configuration for allowed origins
- Input validation through Pydantic schemas
- SQL injection prevention through ORM usage

### Chrome/Selenium Setup
- Download ChromeDriver matching installed Chrome version
- Place ChromeDriver in PATH or project directory
- Headless mode for server deployment
- Automatic browser cleanup on errors

### Testing & Deployment Considerations
- Database transactions for data consistency
- Error logging for monitoring and debugging
- Health check endpoint for load balancers
- Graceful shutdown handling for scheduler cleanup

## Production Deployment

### Environment Setup
```bash
# Production environment variables
export DATABASE_URL="postgresql://user:password@localhost/webmonitor"
export DEBUG=False
export SECRET_KEY="your-secure-secret-key-change-in-production"
export SMTP_SERVER="your-smtp-server.com"
export SMTP_USER="your-email@example.com"
export SMTP_PASSWORD="your-app-specific-password"
```

### Database Setup (PostgreSQL)
```bash
# Create database
createdb webmonitor

# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost/webmonitor"

# Run application (tables auto-create on first start)
cd backend && python main.py
```

### Security Checklist
- [ ] Change default admin password immediately
- [ ] Use HTTPS in production (SSL/TLS certificate)
- [ ] Set strong SECRET_KEY for JWT tokens
- [ ] Configure CORS origins properly
- [ ] Use environment variables for all sensitive data
- [ ] Enable database connection pooling
- [ ] Set up regular database backups
- [ ] Monitor application logs for errors

### Performance Considerations
- Use PostgreSQL for production databases
- Configure connection pooling (built into SQLAlchemy)
- Set appropriate monitoring intervals (avoid too frequent checks)
- Monitor ChromeDriver memory usage
- Consider Redis for session storage in multi-instance deployments

## Troubleshooting

### Common Issues

**ChromeDriver Issues**
- Ensure ChromeDriver version matches Chrome browser
- Download from: https://chromedriver.chromium.org/
- Place in PATH or project directory
- For headless server: `export SELENIUM_HEADLESS=True`

**Database Connection Issues**
```bash
# SQLite: Check file permissions
ls -la backend/webmonitor.db

# PostgreSQL: Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Email Configuration Issues**
- Use app-specific passwords for Gmail/G Suite
- Check SMTP server and port settings
- Verify firewall allows SMTP traffic
- Test SMTP configuration via web interface first

**Monitoring Issues**
- Check XPath selectors with browser dev tools
- Verify target website is accessible
- Look for rate limiting or bot protection
- Check MonitorLogs for detailed error messages

**Frontend Build Issues**
```bash
# Clear node modules if needed
rm -rf node_modules package-lock.json
npm install

# Check for dependency conflicts
npm audit fix
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=True
export LOG_LEVEL=DEBUG

# Run with verbose output
cd backend && python main.py
```