# AURA Vehicles

A production-style vehicle marketplace built with Next.js App Router, Tailwind CSS, NextAuth, Prisma, and PostgreSQL.

## Stack

- Frontend: Next.js + Tailwind CSS + reusable shadcn-style UI primitives
- Backend: Next.js route handlers (`/app/api`)
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth (credentials provider)

## Core Features

- Browse vehicle listings
- Search and filter by keyword, brand, location, and max price
- Vehicle details pages with seller information
- Register and login with secure password hashing
- Protected "Sell Vehicle" route
- User dashboard with edit and delete actions

## Project Structure

- `app/components` UI and feature components
- `app/api` backend route handlers
- `app/vehicles/[id]` vehicle details route
- `app/sell` protected listing form
- `app/dashboard` listing management
- `prisma/schema.prisma` data model and auth tables
- `lib/auth.ts` NextAuth configuration
- `lib/prisma.ts` shared Prisma client

## Environment Variables

Copy `.env.example` to `.env` and update:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## Run Locally

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Visit `http://localhost:3000`.

## Deployment

- App hosting: Vercel
- Managed PostgreSQL: Supabase or Neon

After provisioning your production database, update Vercel environment variables and run Prisma migrations in your deployment workflow.
