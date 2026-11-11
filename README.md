# Software Engineer — Modern Software Marketplace

A complete, production-grade software marketplace website built with **React / TypeScript**, **Tailwind CSS v4**, **Supabase PostgreSQL Database & Authentication**, and **Adsterra Advertising Management**.

---

## Architecture Overview

- **Public Marketplace**:
  - Hero with real-time live software search across titles, descriptions, developers, and platforms.
  - Featured, Latest, Most Popular, Free, and Commercial software sections.
  - Category exploration hub (Developer & DevOps, Design/Creative, Productivity/Office, Security & Privacy).
  - Software details view with screenshot carousels, full markdown descriptions, hardware requirements, and verified download triggers.
  - Adsterra advertisement units across Homepage (Top, Middle, Bottom), Software Details sidebar, and Sticky Footer.
- **User Authentication & Dashboard**:
  - Supabase authentication (Sign Up, Sign In, Password Reset).
  - Customer dashboard with profile editor, avatar update, and authenticated download history log.
- **Administrative Control Panel (`/admin`)**:
  - Protected by Supabase Auth with database-enforced admin roles.
  - KPI overview metrics (Total Software, Published, Draft, Free, Paid, Users, Total Downloads).
  - Software CRUD: Add, edit, delete, publish/unpublish, configure Google Drive / HTTPS download links, upload screenshots and thumbnails, and set system requirements.
  - Category management: Add, edit, delete categories.
  - User moderation: Account status review, suspend/reactivate users.
  - Download telemetry: Real-time download logs filterable by software and date.
  - Adsterra ad manager: Enable/disable placements and configure verified zone IDs.
  - Site branding: Update site name, hero headline, and contact details.

---

## Getting Started Locally

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### 2. Installation
```bash
git clone <repository-url>
cd software-engineer
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your Supabase credentials:
```env
# For Vite Client:
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"

# For Next.js / Vercel:
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

*Note:* If Supabase credentials are not provided initially, the application automatically boots into an active local persistent mode pre-seeded with rich software listings, categories, and test user/admin accounts so everything functions immediately.

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## Supabase PostgreSQL Database Setup

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings > API**, copy your **Project URL** and **anon public key**.

### 2. Run Database Migrations
1. In your Supabase dashboard, navigate to the **SQL Editor**.
2. Open the file `supabase/schema.sql` located in this repository.
3. Paste the entire contents into the SQL Editor and click **Run**.
4. This creates:
   - `profiles`
   - `admins`
   - `categories`
   - `software`
   - `software_images`
   - `downloads`
   - `ads_settings`
   - `site_settings`
   - Complete Row Level Security (RLS) policies
   - Automated triggers for new user profile creation and atomic download counter increments

### 3. Setup Your First Administrator Account
1. Open the Software Engineer app and sign up for an account with your email (e.g. `your-email@example.com`).
2. Open the Supabase **SQL Editor** and run:
```sql
SELECT public.promote_user_to_admin('your-email@example.com');
```
3. Return to the app and refresh. You now have access to the **Admin Console** at `/admin`.

---

## Adsterra Ad Unit Integration

The marketplace contains controlled Adsterra placement slots:
- `homepage_top` (728×90 Leaderboard)
- `homepage_middle` (728×90 Leaderboard)
- `homepage_bottom` (728×90 Leaderboard)
- `software_details` (300×250 Medium Rectangle)
- `sidebar` (300×250 Medium Rectangle)
- `footer` (728×90 or Social Bar)

### How to Configure Adsterra Placements:
1. Log in as an Administrator and go to **Admin Console > Adsterra Ads**.
2. Locate the placement you want to activate.
3. Enter your approved **Adsterra Zone ID**.
4. Toggle the switch to **Enabled**.
5. Save. The ad placement will render safely without executing unsanitized user scripts.

---

## Download Verification System

- **Free Software**: When a visitor or registered user clicks **Download**, the system validates that the software is marked as `is_published: true` and `is_paid: false`. It logs an entry to the `downloads` telemetry table, increments `download_count`, and opens the official Google Drive or HTTPS link.
- **Google Drive URLs**: When linking Google Drive files, set sharing to "Anyone with the link can view". Files over 100MB will display Google Drive's built-in virus scan confirmation.
- **Paid / Commercial Software**: Commercial software displays the configured price and a "Purchase Not Available Yet / Coming Soon" notice. Download links remain strictly hidden and unexposed to unauthorized users until payment integration (Stripe, bKash, Nagad) is completed.

---

## Vercel Deployment Guide

1. Push your code to a GitHub or GitLab repository.
2. Sign in to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. Set up your custom domain in **Project Settings > Domains**.

### Database Backup & Retention
Because Vercel serverless environments are ephemeral, persistent database records and user downloads reside entirely in your Supabase PostgreSQL cluster.
To configure daily automated database backups:
1. Go to Supabase Dashboard > **Database > Backups**.
2. Point-in-time recovery (PITR) is enabled for Pro tiers, or you can take scheduled daily snapshots.

---

## Production Launch Checklist

- [x] Responsive layout tested on desktop, tablet, and mobile.
- [x] Dark / Light theme toggle with Tailwind v4 `@custom-variant dark`.
- [x] Zero-pill discipline applied to all static metadata (`·` typographic separators).
- [x] Live real-time search with instant multi-attribute filtering.
- [x] Supabase PostgreSQL migration script with complete RLS policies.
- [x] Admin console with KPI cards, software CRUD, category taxonomy, and user status toggling.
- [x] Secure download execution with server-side validation and telemetry logging.
- [x] Controlled Adsterra banner slots with Zone ID sanitation.
- [x] Paid software download URLs safely masked.
