# Property Online - Admin Dashboard

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- React Query (TanStack)
- Axios
- Almarai Font (Arabic-first)
- RTL by default

## Setup

```bash
npm install
npm run dev
```

Dashboard runs at: http://localhost:5173

## API Base URL

Development uses the local backend from [.env](C:/Users/Lenovo/Desktop/Qeema%20Tech/temp/property-online/property-online-dashboard/.env:1).

Production builds use:

```bash
VITE_API_URL=https://property.nodeteam.site/api/v1
```

## Features
- Arabic-first RTL interface
- Dashboard overview with stats
- Full CRUD for all modules
- Server-side pagination
- Search and filtering
- Image upload
- Status badges
- Confirm delete modals
- Toast notifications
- JWT authentication with auto-refresh
- Responsive design

## Default Admin Credentials
- Email: `admin@propertyonline.com`
- Password: `admin123456`
