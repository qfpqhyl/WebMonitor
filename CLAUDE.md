# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WebMonitor is a web content monitoring and notification system that provides real-time monitoring of webpage content changes with multi-channel notification support.

### Current Architecture
- **Early Version**: Pure Python scripts (functional, available in `EarlyScripts/`)
- **New Version**: React + TypeScript frontend + FastAPI + Python backend + PostgreSQL (in development)

## Development Commands

### Early Scripts Version (Currently Functional)
```bash
# Navigate to early scripts
cd EarlyScripts

# Install dependencies
pip install -r ../requirements.txt

# Configure environment variables
vim .env

# Run the monitoring script
python main.py
```

### New Version Development

#### Backend (FastAPI + Python)
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run with built-in development mode
python main.py

# Access API documentation
# http://localhost:8000/docs (Swagger UI)
# http://localhost:8000/redoc (ReDoc)

# Health check
curl http://localhost:8000/health
```

#### Frontend (React + TypeScript)
```bash
# Navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

#### Dependencies Management
```bash
# Root Python dependencies (shared)
pip install -r requirements.txt

# Backend-specific dependencies
cd backend && pip install -r requirements.txt

# Key backend dependencies:
# - fastapi==0.104.1 (web framework)
# - uvicorn[standard]==0.24.0 (ASGI server)
# - sqlalchemy==2.0.23 (ORM)
# - selenium==4.15.2 (web scraping)
# - apscheduler==3.10.4 (task scheduling)
# - pydantic==2.5.0 (data validation)

# Frontend dependencies are managed via package.json
# Key frontend dependencies:
# - React 18.2.0 (UI framework)
# - Material-UI 5.15.0 (component library)
# - React Router 6.20.1 (routing)
# - Axios 1.6.2 (HTTP client)
```

## Architecture & Code Structure

### Early Scripts Architecture (`EarlyScripts/`)
- **`main.py`**: Core monitoring script with Selenium-based web scraping
  - Uses headless Chrome for dynamic content rendering
  - Monitors multiple URLs with XPath selectors
  - Implements change detection with configurable intervals
  - Integrates email notifications via `outlooknotice.py`
- **`outlooknotice.py`**: Email notification module
  - SMTP-based email sending with SSL support
  - Environment variable configuration for security
  - Attachment support capability

### New Version Architecture

#### Backend (`backend/`)
- **`main.py`**: FastAPI application entry point with lifecycle management
- **`app/core/config.py`**: Application settings and environment configuration
- **`app/api/`**: API routes and endpoints (`routes.py`, `main.py`)
- **`app/db/`**: Database layer (models, CRUD operations, database connection)
  - Uses SQLAlchemy ORM with SQLite/PostgreSQL support
  - `models.py`: Database models for monitor tasks, logs, users
  - `crud.py`: Database CRUD operations
- **`app/services/`**: Business logic layer
  - `monitor_service.py`: Core web scraping with Selenium WebDriver
  - `email_service.py`: SMTP email notifications
  - `scheduler.py`: APScheduler-based task scheduling
- **`app/schemas/`**: Pydantic data models for API request/response validation
- **`app/utils/`**: Utility functions including logging

#### Frontend (`frontend/`)
- **React + TypeScript** with Material-UI component library
- **`src/App.js`**: Main application component
- **`src/components/`**: Reusable UI components
  - `Layout.js`: Application layout wrapper
  - `StatCard.js`: Dashboard statistics cards
- **`src/index.js`**: React application entry point
- **Development proxy** configured to backend at `http://localhost:8000`
- **Material-UI X Data Grid** for data management
- **React Query** for server state management
- **Day.js** for date/time handling

#### Database
- **Development**: SQLite (`sqlite:///./webmonitor.db`)
- **Production**: PostgreSQL (configurable via `DATABASE_URL`)
- **Migration support** through SQLAlchemy Alembic patterns

## Configuration

### Environment Variables (.env)

#### Email Configuration (Required for both versions)
- `SMTP_SERVER`: SMTP server address (e.g., smtp.feishu.cn)
- `SMTP_PORT`: SMTP port (default: 465)
- `SMTP_USER`: Sender email address
- `SMTP_PASSWORD`: SMTP password/app-specific password
- `RECEIVER_EMAIL`: Notification recipient email

#### Backend Configuration (New version)
- `DATABASE_URL`: Database connection string (default: sqlite:///./webmonitor.db)
- `DEBUG`: Enable debug mode (default: False)
- `LOG_LEVEL`: Logging level (default: INFO)
- `BACKEND_CORS_ORIGINS`: CORS allowed origins (default: http://localhost:3000)

#### Monitoring Configuration
- `DEFAULT_CHECK_INTERVAL`: Default monitoring interval in seconds (default: 300)
- `MAX_CHECK_INTERVAL`: Maximum allowed interval (default: 86400)
- `MIN_CHECK_INTERVAL`: Minimum allowed interval (default: 10)
- `SELENIUM_HEADLESS`: Run Selenium in headless mode (default: True)
- `SELENIUM_TIMEOUT`: Selenium timeout in seconds (default: 30)

### XPath Configuration
Monitoring targets are configured via URL-XPath pairs in `main.py:151`:
```python
url_xpath_pairs = {
    "https://example.com": "/html/body/div[1]/div[2]",
    # Add more URLs and XPaths as needed
}
```

## Key Implementation Details

### Web Scraping Strategy
- **Selenium WebDriver**: Used for dynamic content that requires JavaScript execution
- **Headless Chrome**: Runs without GUI for server deployment
- **XPath Selectors**: Precise element targeting for content extraction
- **Error Handling**: Robust error handling with automatic browser cleanup

### Change Detection
- **Content Comparison**: Simple string-based change detection
- **State Management**: In-memory storage of last known content per URL
- **Title Extraction**: Automatic webpage title extraction for notifications

### Email Notifications
- **SMTP SSL**: Secure email delivery via SMTP SSL
- **Unicode Support**: Proper UTF-8 encoding for international content
- **Debug Mode**: Configurable SMTP debugging for troubleshooting

## Development Notes

### Security Considerations
- Environment variables are properly excluded from version control via `.gitignore`
- Use app-specific passwords for email authentication instead of main passwords
- Selenium runs in sandboxed mode with minimal Chrome options

### ChromeDriver Requirements
- Download ChromeDriver matching the installed Chrome browser version
- Add ChromeDriver to system PATH or place in project directory

### Monitoring Workflow
1. Initial content fetch and storage for all configured URLs
2. Periodic content comparison at specified intervals
3. Email notification generation when changes are detected
4. Automatic state update with new content
5. Continuous monitoring loop with error recovery

## Development Workflow

### Running the Full Application
```bash
# Terminal 1: Start backend
cd backend
python main.py  # or: uvicorn main:app --reload

# Terminal 2: Start frontend
cd frontend
npm start

# Access the application:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Application Lifecycle
- **Backend startup**: Automatically creates database tables, starts monitoring scheduler
- **Scheduler**: APScheduler runs in background, managing all monitoring tasks
- **Web scraping**: Selenium WebDriver with headless Chrome for dynamic content
- **Change detection**: Content comparison with database persistence
- **Notifications**: Email service sends alerts on content changes

### Database Schema Key Points
- **Monitor Tasks**: Store URLs, XPath selectors, intervals, and current content
- **Monitor Logs**: Track all monitoring attempts and results
- **Content Hashing**: Efficient change detection using content hashes
- **Automatic cleanup**: Configurable log retention policies

## Future Development (New Version)

The new version provides:
- ✅ Modern web interface with React + Material-UI
- ✅ RESTful API with FastAPI and automatic documentation
- ✅ Database persistence with SQLAlchemy ORM
- ✅ Scheduled monitoring with APScheduler
- 🚧 Real-time monitoring dashboard (in development)
- 🚧 Visual configuration management (in development)
- 🚧 Multiple notification channels (planned)
- 🚧 Monitoring history and statistics (planned)
- 🚧 Multi-user support (planned)

When working on the new version:
- The backend is functional with core monitoring capabilities migrated from EarlyScripts
- Frontend provides basic UI structure but needs full feature implementation
- Database models support extensibility for future features
- API follows RESTful conventions with Pydantic validation
- Consider deployment with Docker containers for production