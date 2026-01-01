# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Appraise Map Portal is a property appraisal management application for Graha Paramita Konsultan. It combines geolocation mapping, data management, and document generation capabilities.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Maps**: Google Maps API (@react-google-maps/api)
- **UI**: Tailwind CSS + shadcn/ui (Radix-based components)
- **Forms**: React Hook Form + Zod validation
- **Documents**: Docko API integration with Firebase for real-time progress

## Architecture

### Route Structure

- `/app/dashboard/` - Main application area (protected)
  - `maps/` - Property visualization on Google Maps
  - `data-management/` - CRUD operations, import/export
  - `documents/` - Document generation via Docko API (beta feature)
  - `settings/` - Admin user management
- `/app/api/docko/` - API proxy routes for Docko service
- `/app/login/` - Authentication pages

### Key Files

- `app/services/dataManagement.service.ts` - Main business logic for properties, valuations, locations
- `app/services/docko.service.ts` - Docko API client
- `app/lib/supabaseClient.ts` - Supabase browser client
- `app/types/types.ts` - Core domain types (Property, Valuation, Location)
- `middleware.ts` - Route protection with session validation

### Component Patterns

- Server components for data fetching, "use client" for interactive components
- shadcn/ui components in `/components/ui/` (auto-generated, extend via shadcn CLI)
- Custom components colocated in feature directories (e.g., `dashboard/maps/components/`)

### State Management

- React hooks (useState, useEffect, useCallback) - no Redux/Zustand
- SnackBarProvider context for toast notifications
- Service layer abstracts all Supabase operations

## Custom Theme Colors

Defined in `tailwind.config.ts`:
- `c-blue` (#0A61A6) - Primary brand color
- `c-gray`, `c-golden`, `c-light-blue`, `c-light-golden` - Supporting palette

## Environment Variables Required

```
NEXT_PUBLIC_MAPS_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_DOCKO_API_URL
DOCKO_API_KEY
NEXT_PUBLIC_FIREBASE_* (for Docko formatting progress)
```
