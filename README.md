# Iliadis Executive Cars Digital Showroom

A cinematic, luxury-grade Next.js experience for Iliadis Executive Cars. The experience blends Tailwind CSS styling with Framer Motion micro-interactions to create a digital showroom, test-drive concierge and authenticated admin cockpit backed by Prisma + PostgreSQL.

## Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [Tailwind CSS](https://tailwindcss.com/) for the "Salt & Pepper" visual language
- [Framer Motion](https://www.framer.com/motion/) for parallax hero, hover glows and animated transitions
- Headless UI Listbox for refined filtering interactions

## Getting Started

```bash
npm install
npm run dev
```

The development server starts on [http://localhost:3000](http://localhost:3000). Pages include:

- `/` – Hero-led home page with cinematic video, highlights and collection teasers
- `/showroom` – Filterable gallery backed by live vehicle records stored in PostgreSQL via Prisma
- `/showroom/[slug]` – Rich vehicle detail layout with gallery, specs and optional engine audio
- `/test-drive` – Animated concierge form that also stores booking requests in the database
- `/dashboard` – Secure admin area (NextAuth) for managing vehicles, leads, bookings and CSV imports

## Database setup

1. Duplicate the environment template and provide database + auth secrets:

   ```bash
   cp .env.example .env
   ```

2. Set `DATABASE_URL`, `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (production hostname) inside `.env`.
3. Run the initial migration and generate the Prisma Client:

   ```bash
   npm run prisma:migrate
   npm run prisma:gen
   ```

4. (Optional) Seed starter data by editing `prisma/seed.ts` and executing `npm run db:seed`. Hash admin passwords with `bcryptjs.hash(password, 10)` before storing them.

## CSV import

Administrators can bulk upsert vehicles from `/dashboard/vehicles` using UTF-8 CSV files. Headers must match exactly:

```
slug,title,make,model,year,price,mileage,engine_cc,hp,fuel,transmission,body,color,location,description,images,audio_urls,featured
```

- `images` and `audio_urls` accept pipe-delimited values (e.g. `image-1.jpg|image-2.jpg`).
- Numeric fields (`year`, `price`, `mileage`, `engine_cc`, `hp`) are coerced automatically; blanks fall back to `0`.
- Existing records are matched by `slug` and updated; new slugs create fresh vehicles.

## Assets

- `public/images/iliadis-logo.svg` – Iliadis Executive Cars logotype
- `public/images/showroom-preview.svg` – Social preview artwork
- `public/sounds/` – Place mastered audio files referenced from the Prisma `audio_urls` array.

## Schema & SEO

Each page injects [schema.org Vehicle](https://schema.org/Vehicle) metadata and tuned OpenGraph/Twitter cards for elevated search appearance.

## Customisation

- Update vehicle records directly through Prisma, the dashboard forms, or CSV import.
- Framer Motion interactions remain in client components. Motion, colour and typography tokens live in `tailwind.config.ts` and `app/globals.css`.
