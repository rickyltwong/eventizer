# Eventizer - "Balance Studio" Event Management System

## Description

This is a event management system for a fictional company called "Balance Studio" - a yoga studio that hosts various events. The system allows users to view events, sign up for events, and view their tickets. Admins can manage events, users, and tickets. The system also provides analytics for admins.

## Features

- Event Listings Browsing Interface
- Event Near Me
- Fast Access Sign-up for Tickets (F.A.S.T)
- Event Details and Event Registration
- Email Notifications for Payment Confirmation
- OR Code Generation for Tickets
- User Profile Management
- Payemnt Gateway Integration
- User Sign-up and Authentication
- Event Registration Histroy and Status
- Users and Attendees Management
- Events Management
- Events Statistics
- Custom Ticket Classes & Prices
- Ticket Pricing and Discount Settings
- Theme Toggling

## Pages

- `/events` - Event listings page
  - consists of "Gallery", "Map", and "Calendar" views
  - with "Filter" and "Sort" options
  - with "Search" bar (to be implemented)
- `/events/[event_id]` - Details of a specific event
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/admin/analytics` - Admin dashboard
- `/admin/events` - Events management page
- `/admin/tickets` - Tickets management page
- `/admin/usermanagement` - User management page
- `/admin/attendee` - Attendees management page

## API

- `/api/events` - GET all events
- `/api/events` - POST a new event
- `/api/events` - PUT update an event
- `/api/events` - DELETE an event
- `/api/events/[event_id]` - GET a specific event
- `/api/auth/signin` - POST sign in
- `/api/auth/signup` - POST sign up
- `/api/admin` - GET all users
- `/api/admin/` - POST a new user
- `/api/admin/` - PUT update a user
- `/api/admin/` - DELETE a user

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
