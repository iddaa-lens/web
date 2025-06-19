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

### Build & Deployment
```bash
# Using Makefile (recommended)
make help                                    # Show all available commands
make dev                                     # Start development server
make build                                   # Build Next.js application
make lint                                    # Run ESLint
make docker-build-local                      # Build Docker image locally
make docker-build ORG=registry.io TAG=v1.0   # Build Docker image with tags
make docker-push ORG=registry.io TAG=v1.0    # Push Docker image
make deploy                                  # Deploy to Kubernetes using deploy.sh
make k8s-status                              # Show Kubernetes deployment status
make k8s-logs                                # Show application logs
```

### Common Development Tasks
```bash
# Install dependencies
npm install

# Run tests
npm test                 # Run Jest tests once
npm test:watch           # Run Jest tests in watch mode

# Check TypeScript types (no dedicated command, use build)
npm run build
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
- **Containerization**: Docker with standalone Next.js output for production deployment
- **Orchestration**: Kubernetes-ready with full manifest suite

### API Integration Points
The frontend expects these backend endpoints:
- `/api/odds/big-movers` - Returns matches with significant odds changes
- `/api/events/upcoming` - Returns events within 6-hour window

### Deployment Configuration
- **Docker**: Multi-stage build with standalone output mode
- **Kubernetes**: Deployment, Service, and Ingress manifests in `/k8s/`
- **Registry**: Configured for Azure Container Registry (iddaalens.azurecr.io)
- **SSL/TLS**: Automatic certificate management via cert-manager
- **Domains**: iddaalens.com and www.iddaalens.com

### Testing Setup
- **Framework**: Jest with React Testing Library and Next.js integration
- **Configuration**: jest.config.js with custom path mappings
- **Test Location**: `__tests__/` directory mirroring component structure
- **Commands**: `npm test` for single run, `npm test:watch` for watch mode

### Important Notes
- The app is Turkish-language focused (navigation, UI text)
- Image domains are whitelisted in next.config.ts for external sports images
- Safe area insets are handled for modern mobile devices
- The `/src/` directory contains legacy React components and should be ignored
- Tailwind CSS v4 uses custom Iddaa brand colors (--color-iddaa-primary, --color-iddaa-secondary)