# Web - Static Frontend

A static Next.js frontend based on the web-ui structure but without API dependencies.

## Features

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Responsive design (mobile-first)
- Dark mode support
- Component library (UI components)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `app/` - Next.js App Router pages
- `components/` - React components
  - `ui/` - Reusable UI components
  - `layout/` - Layout components
- `lib/` - Utility functions
- `public/` - Static assets

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

This project is a cleaned-up version of web-ui with:
- No API calls or data fetching
- No authentication system
- No external dependencies for data
- Simplified navigation and components
- Static content only

Perfect for use as a starting point for new projects or for copying to other locations.