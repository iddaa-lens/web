# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

### Environment Variables
The application uses environment variables to manage API endpoints for different environments:

- **Development**: `.env.local` - `NEXT_PUBLIC_API_URL=http://localhost:8080`
- **Production**: `.env.production` - `NEXT_PUBLIC_API_URL=https://api.iddaalens.com`

Create `.env.local` for local development. Next.js will automatically use `.env.production` during production builds.

## Commands

### Development
```bash
npm run dev      # Start development server on http://localhost:3000 (uses .env.local)
npm run build    # Build for production (uses .env.production)
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Common Development Tasks
```bash
# Install dependencies
npm install

# Check TypeScript types (no dedicated command, use build)
npm run build

# No test commands available - testing framework not configured
```

## Architecture Overview

This is a Next.js 15 web application using App Router for a betting analysis platform (IddaaLens). The architecture follows these key patterns:

### Component Structure
- **UI Components** (`/components/ui/`): Reusable primitives built with Radix UI and styled using CVA (Class Variance Authority) for variant-based styling
- **Layout Components** (`/components/layout/`): Page structure components with separate mobile and desktop implementations
- **Page Components** (`/app/`): File-based routing with Next.js App Router

### Data Flow
- Client-side data fetching using fetch API in React components
- API endpoints configured via `NEXT_PUBLIC_API_URL` environment variable
- No global state management - local component state with React hooks
- TypeScript interfaces define API response shapes

### Styling Approach
- Tailwind CSS v4 with custom CSS variables for responsive dimensions
- Mobile-first responsive design with specific breakpoints
- Dark mode support throughout using Tailwind classes
- Component variants managed with CVA

### Key Technical Decisions
- **Responsive Design**: Separate mobile/desktop layout components rather than purely responsive CSS
- **Type Safety**: Strict TypeScript configuration with interfaces for all data structures
- **Component Library**: Custom UI components wrapping Radix UI primitives
- **API Integration**: Direct fetch calls without abstraction layer or data fetching library

### API Integration Points
The frontend expects these backend endpoints:
- `/api/odds/big-movers` - Returns matches with significant odds changes
- `/api/events/upcoming` - Returns events within 6-hour window

### Important Notes
- No testing framework is configured - avoid suggesting test-specific commands
- The app is Turkish-language focused (navigation, UI text)
- Image domains are whitelisted in next.config.ts for external sports images
- Safe area insets are handled for modern mobile devices