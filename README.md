# "Balance Studio" Event Management System - Powered by Eventizer

## Table of contents

- [Description](#description)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Contributions](#contributions)
  - [Ricky Wong](#ricky-wong)
  - [Kajanan Sivarajah](#kajanan-sivarajah)
  - [Reina Ezebasilim](#reina-ezebasilim)
  - [Bahare Ghasemi](#bahare-ghasemi)
  - [Emma Zhang](#emma-zhang)
- [Demo](#demo)

## Description

This is an implementation of a generic event management platform called "Eventizer" for a fictional company called "Balance Studio" - a yoga studio that hosts various events. The system allows users to view events, sign up for events, and view their tickets. Admins can manage events, users, and tickets. The system also provides analytics for admins.

## Technologies Used

- Framework: Next.js 14 App Router
- Database: MongoDB, Firebase Firestore
- Authentication: NextAuth.js
- UI components: Mantine
- Styling: Native CSS and Tailwind
- Code Linting: ESLint, Husky, lint-staged
- Formatting: prettier
- Deployment: Vercel

## Screenshots

- [Work by Ricky Wong](https://github.com/rickyltwong/eventizer/blob/readme-update/screenshots/ricky/README.md)
- [Work by Kajanan Sivarajah](https://github.com/rickyltwong/eventizer/blob/readme-update/screenshots/kajanan/README.md)
- [Work by Reina Ezebasilim](https://github.com/rickyltwong/eventizer/blob/readme-update/screenshots/reina/README.md)
- [Work by Bahare Ghasemi](https://github.com/rickyltwong/eventizer/blob/readme-update/screenshots/bahare/README.md)
- [Work by Emma Zhang](https://github.com/rickyltwong/eventizer/blob/readme-update/screenshots/emma/README.md)

## Contributions

### Ricky Wong

- setup code repository, implement the basic structure of the project
- implement linting and formatting tools to ensure code quality and efficient app building and deployment
- solve lint errors, type errors, and deployment issues to ensure successful deployment

#### Features

- Beautiful event listings Browsing Interface
  - consists of "Gallery", "Map", and "Calendar" views
  - with "Filter" option to filter events by "EventType/Category"
  - with Pagination feature
- Event Near Me (MapView of events)
- NextAuth/ Auth.js Signin and Authentication with Google OAuth and Credentials

#### Related Pages and APIs

- `/events` - Event listings page
  - leveraging "PaulLeCam/react-leaflet" for map view
  - leveraging "jquense/react-big-calendar" for calendar view
- `/api/auth/signin?callbackUrl=https%3A%2F%2Feventizer-gray.vercel.app` - Sign in page

- `GET /api/events` - Get all events

#### Learning Curves

- Implementing Mantine UI components library
- Integrating Auth.js(aka NextAuth) with Google OAUth with firebase, further integration with users records in mongodb
- Using TypeScript
- Implementing code checking and linting tools like ESLint, Husky, and lint-staged to enforce code quality and uniformity

#### Challenges and Solutions

- Challenge: Hard to deploy because of TypeScript errors
  - Solution: Follow the Next.js and typescript documentation to fix the errors
- Auth.js is not mature for production use (for example no custom error is allowed in the signin page)
  - Solution: Tracking the github issues and documenting the issues and references in the code
- Poor Documentation of Auth.js
  - Solution: Read the source code and examples in the Auth.js repository
- Non-uniformity of the codebase due to the lack of linting and formatting tools at the beginning
  - Solution: Implement linting and formatting tools (prettier, eslint and husky) to enforce code quality and uniformity

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

#### Learning Curves

#### Challenges and Solutions

### Reina Ezebasilim

#### Features

- User Sign-up
- User Profile Panel
- Event Registration History and Status in User Profile
- Event favorites - like and unlike events in listing page

#### Related Pages and APIs

- `/auth/signup` - Sign up page
- `/user/registration-history` - User registration history page
- `/user/favorites` - User favorites page
- POST `/api/auth/signup` - Create new User
- GET `/api/user/[userId]/favorites` - fetch user favorite events
- POST `/api/user/[userId]/favorites` - add a favorite event (like an event)
- DELETE `/api/user/[userId]/favorites` - delete a favorite event (unlike an event)
- GET `/api/user/[userId]/tickets` - fetch user registration history

#### Learning Curves

#### Challenges and Solutions

### Bahare Ghasemi

#### Features

- Events Analytics: Dashboard to analyze running events and their sales trends and remainig seats by events types and dates.
- Users Management : Manage all users and change their status or role
- Attendees Management: Manage all user registered for events and check-in status or registration status

#### Related Pages and APIs

- `/admin/analytics` - Admin dashboard for analytics
- `/admin/usermanagement` - User management page
- `/admin/attendee` - Attendees management page

- `GET, POST, PUT, DELETE /api/admin` - Change in users or a certain user
- `POST, PUT, DELETE /api/attendee` - Manage attendees and Check-in for a sepecific event and user
- `GET /api/attendee` -Get EventTickets and Merge by User and /api/events Event
- `GET /api/admin2` -Ticket Sales for analytics

#### Learning Curves

- Handling caching in fetch parts and dynamic pages

#### Challenges and Solutions

### Emma Zhang

#### Features

- Events Management
- Custom Ticket Classes & Prices
- Ticket Pricing and Discount Settings

#### Related Pages and APIs

- `/admin/events` - Events management page
- `/admin/tickets` - Tickets management page

- `GET, POST, PUT, DELETE /admin/api/events` - Manage events
- `GET, POST, PUT, DELETE /admin/api/tickets` - Manage tickets

#### Learning Curves

#### Challenges and Solutions

## Demo

[Eventizer](https://eventizer-gray.vercel.app)([https://eventizer-gray.vercel.app](https://eventizer-gray.vercel.app))

To access the admin dashboard, use the following credentials:

```plaintext
email: admin@admin.com
password: admin
```

The admin dashboard is accessible at [`https://eventizer-gray.vercel.app/admin`](https://eventizer-gray.vercel.app/admin) (click it to enter).

To run the project locally, please make sure that you have the following environment variables set up in `.env.local`:

```env
AUTH_URL=http://localhost:3000
```
