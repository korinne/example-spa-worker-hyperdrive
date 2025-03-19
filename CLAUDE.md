# CLAUDE.md - Development Guide

## Build/Deploy Commands
- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm run preview` - Preview production build locally

## Local Environment Setup
- `docker-compose up -d` - Start local PostgreSQL database
- Connection string: `postgresql://myuser:mypassword@localhost:5432/mydatabase`

## Code Style Guidelines
- **Framework**: React 19 with Suspense, Vite, Cloudflare Workers
- **API**: Hono.js for handling API routes
- **Database**: PostgreSQL via Hyperdrive
- **Formatting**: ESLint with React recommended config
- **Imports**: Use named imports, maintain clean dependency order
- **Error Handling**: Use try/catch with specific error messages
- **Component Structure**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for variables/functions
- **File Organization**: Components in src/, API routes in api/