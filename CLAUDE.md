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

### Dependencies Management
```bash
# Install Python dependencies
pip install -r requirements.txt

# Key dependencies:
# - python-dotenv>=0.19.0 (environment variables)
# - selenium>=4.0.0 (web scraping and dynamic content)
# - lxml>=4.6.0 (XML/HTML parsing)
# - requests>=2.25.0 (HTTP requests)
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

### New Version (Planned/In Development)
- **Frontend**: React + TypeScript (in `frontend/`)
- **Backend**: FastAPI + Python (in `backend/`)
- **Database**: PostgreSQL

## Configuration

### Environment Variables (.env)
Required for both early and new versions:
- `SMTP_SERVER`: SMTP server address (e.g., smtp.feishu.cn)
- `SMTP_PORT`: SMTP port (default: 465)
- `SMTP_USER`: Sender email address
- `SMTP_PASSWORD`: SMTP password/app-specific password
- `RECEIVER_EMAIL`: Notification recipient email

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

## Future Development (New Version)

The new version will provide:
- Modern web interface with React
- Real-time monitoring dashboard
- Visual configuration management
- Multiple notification channels
- Monitoring history and statistics
- Multi-user support

When working on the new version:
- Follow the planned frontend/backend separation
- Implement the core monitoring logic from EarlyScripts as the backend foundation
- Maintain the same environment variable configuration approach
- Consider migrating from in-memory state to PostgreSQL persistence