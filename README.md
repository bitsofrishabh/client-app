# DietTracker Client App

A mobile-first application for diet tracking clients to log meals, track progress, and communicate with their dieticians.

## Features

- **Meal Logging**: Photo upload and meal description
- **Progress Tracking**: Daily activity tracking with visual progress indicators
- **Real-time Chat**: Direct communication with assigned dieticians
- **Weight Tracking**: Personal weight logging and progress visualization
- **Mobile-First Design**: Optimized for mobile devices with PWA capabilities

## Firebase Integration

This app uses the same Firebase project as the dietician dashboard for seamless data synchronization:

- **Authentication**: Email/password authentication for clients
- **Firestore**: Real-time data sync with dietician dashboard
- **Storage**: Meal photo uploads and chat image sharing
- **Real-time Updates**: Instant sync of messages and progress updates

## Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Deployment

This app is designed to be deployed separately from the dietician dashboard, allowing for:

- **Different domains**: e.g., `clients.diettracker.com` vs `dashboard.diettracker.com`
- **Separate scaling**: Independent scaling based on client vs dietician usage
- **Role-based access**: Clear separation of client and dietician interfaces
- **Custom branding**: Different branding for client-facing vs professional interfaces

## Technology Stack

- React 18 with TypeScript
- Ant Design for UI components
- Firebase for backend services
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling