# "Balance Studio" Event Management System - Powered by Eventizer

## Description

This is an implementation of a generic event management platform called "Eventizer" for a fictional company called "Balance Studio" - a yoga studio that hosts various events. The system allows users to view events, sign up for events, and view their tickets. Admins can manage events, users, and tickets. The system also provides analytics for admins.

## Contributions

### Ricky Wong

#### Features

- Event Listings Browsing Interface (Gallery View of events)
  - consists of "Gallery", "Map", and "Calendar" views
  - with "Filter" option to filter events by "EventType/Category"
- Event Near Me (MapView of events)
- NextAuth/ Auth.js Signin and Authentication with Google OAuth and Credentials

#### Related Pages and APIs

- `/events` - Event listings page
- `/api/auth/signin?callbackUrl=https%3A%2F%2Feventizer-gray.vercel.app` - Sign in page

#### Learning Curves

- Integrating NextAuth with Google OAUth with firebase, further integration with users records in mongodb

#### Challenges and Solutions

### Kajanan Sivarajah

#### Features

- Event Details and Event Registration
- Email Notifications for event registration
- OR Code Generation for Tickets

#### Related Pages and APIs

- `/events/[event_id]` - Details of a specific event

- `GET /api/events/[event_id]` - Manage a specific event
- `GET /api/events[event_id]/ticket` - Check ticket detail
- `POST /api/events/[eventId]/register` - register for an event
- `GET /api/events/[eventId]/attendance?userid=...?ticketid=...` - marking a user's attendance at an event using

### Reina Ezebasilim

#### Features

- User Sign-up
- User Profile Panel
- Event Registration Histroy and Status in User Profile
- Event favorites - like and unlike events in listing page

#### Related Pages and APIs

- `/signup` - Sign up page
-

### Bahare Ghasemi

#### Features

- Users and Attendees Management
- Events Statistics
-

#### Related Pages and APIs

- `/admin/analytics` - Admin dashboard for analytics
- `/admin/usermanagement` - User management page
- `/admin/attendee` - Attendees management page

- `GET, POST, PUT, DELETE /api/admin` - GET all users or a certain user
- `GET, POST, PUT, DELETE /api/attendee` - Manage attendees
-

#### Learning Curves

#### Challenges and Solutions

### Emma Zhang

#### Features

- Events Management
- Custom Ticket Classes & Prices
- Ticket Pricing and Discount Settings

#### Related Pages and APIs

- `/admin/events` - Events management page
- `/admin/tickets` - Tickets management page

#### Learning Curves

#### Challenges and Solutions

## Technologies Used

- Framework: Next.js 14 App Router
- Database: MongoDB, Firebase Firestore
- Authentication: NextAuth.js
- UI components: Mantine
- Styling: Native CSS and Tailwind
- Code Linting: ESLint, Husky, lint-staged
- Formatting: prettier
- Deployment: Vercel
