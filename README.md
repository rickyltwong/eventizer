# Eventizer - "Balance Studio" Event Management System

## Description

This is a event management system for a fictional company called "Balance Studio".

## URLs for the web app (as of now)

- `http://localhost:3000/events` - List of all events
  - consists of "Gallery", "Map", and "Calendar" views
  - fetch events from `GET /api/events` which retrieves events from MongoDB
- `http://localhost:3000/events/<event_id>` - Details of a specific event
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/admin` - Admin dashboard
- `/admin/events` - Events management page
- `/admin/events/usermanagement` - User management page
- `/admin/analytics` - Admin dashboard
- `/admin/tickets` - Tickets management page
