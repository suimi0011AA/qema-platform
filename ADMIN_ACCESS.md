# Admin Access Guide

## Overview
The Qema Platform has been configured with admin-only access for registration, login, and event management.

## Admin Access

### How to Access Admin Panel

1. **Direct URL**: Open `admin-login.html` in your browser
2. **Or visit**: `http://localhost:3001/admin-login.html`
3. Click "دخول لوحة التحكم" to access the admin login page

### Admin Features

- **Login/Register**: Only accessible through admin portal
- **Dashboard**: View and manage all events
- **Create Events**: Add new events to the platform
- **Edit Events**: Modify existing event details
- **Delete Events**: Remove events (stays logged in after deletion)

### Public Features

- **Browse Events**: Anyone can view published events
- **Search & Filter**: Public can search and filter events
- **Event Details**: View full event information
- **Programs**: Browse available programs

## Design Updates

### Gray Shades Added
The design now includes an enhanced gray palette:
- `--gray-50` to `--gray-900`: Full range of gray shades
- Used throughout the interface for better visual hierarchy
- Improved contrast and readability

## Bug Fixes

1. **Event Editing**: Now fully functional - redirects to edit page
2. **Delete Event**: Fixed logout issue - user stays logged in after deleting events
3. **Admin Access**: Login/Register hidden from public, only accessible via admin portal

## Technical Details

### Router Changes
- Admin routes: `/dashboard`, `/create-event`, `/edit-event/:id`
- Protected routes require authentication
- Public cannot access login/register without admin flag

### Admin Detection
The system checks for `?admin=true` in the URL to allow access to login/register pages.

## Usage

### For Admins
1. Visit `admin-login.html`
2. Login with your credentials
3. Access dashboard to manage events

### For Public Users
1. Visit the main site
2. Browse events without login
3. No registration option visible