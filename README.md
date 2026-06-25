# PromptForge - AI Prompt Sharing & Marketplace Platform

Welcome to **PromptForge**, a recruiter-friendly, feature-packed SaaS community marketplace for AI prompt engineering. This platform allows prompt enthusiasts, creators, and administrators to discover, bookmark, review, moderate, and trade high-quality prompts for ChatGPT, Gemini, Claude, Midjourney, and other AI engines.

---

## Live URL
- **Front-End Deployment**: [https://prompt-forge-nexus.vercel.app](https://prompt-forge-nexus.vercel.app)
- **API Server Deployment**: [https://prompt-forge-server.onrender.com](https://prompt-forge-server.onrender.com)

---

## Core Features

### 1. Modern SaaS Landing Page (Public Route)
- **Advanced Hero Banner**: Includes dynamic tag filter searches and call-to-actions.
- **Why Choose Us & How It Works**: Sleek glassmorphism sections highlighting platforms benefits.
- **Featured Prompts**: Highlights 6 popular prompt cards directly from the database.
- **Top Creators & Testimonials**: Showcases rating aggregations and sliding cards.

### 2. Marketplace Catalog (Public Route)
- **Dynamic Search & Autocomplete**: Realtime backend-driven lookup by title, tag, or AI tool.
- **Multi-Level Filters**: Sort and narrow templates by engine type, category, or difficulty level (Beginner, Intermediate, Pro).

### 3. Prompt Details View (Private Route)
- **Visibility Safeguards**: Public prompts show full contents, whereas Premium (Private) prompts lock, blur content, and prompt checkout redirects.
- **Interaction Dashboard**: One-click clipboard copy (increments copy count), bookmarks (toggles DB collections), review writing (recalculates averages), and reports.

### 4. Stripe Payment Processing (Private Route)
- Secure subscription upgrading checkout system for **Lifetime Pro Plan** ($5.00 one-time fee).

### 5. Multi-Role Dashboards (User, Creator, Admin Panels)
- **User Dashboard**: Add prompt (limit 3 for free users), view my reviews, manage bookmarks.
- **Creator Dashboard**: View template analytics with **Recharts** visualizations (copies, bookmarks, and growth).
- **Admin Dashboard**: Manage user roles, approve/reject template submissions with moderator comments, refund payment logs, and review reported content.

---

## Technical Stack & Packages Used

### Client-Side Core
- **Framework**: Next.js App Router (`^16.2.9`)
- **Language**: JavaScript (React 19, HTML5)
- **Styling**: Vanilla CSS, TailwindCSS post-processing (`^4`), `@heroui/react` (`^3.2.1`)
- **Authentication**: Better-Auth (`^1.6.19`) with JWT strategy and social Google Providers.
- **Visuals & Charts**: Recharts (`^3.8.1`), Framer Motion (`^12.40.0`), `@gravity-ui/icons`, and `lucide-react`.
- **API Utilities**: `jsonwebtoken`, `react-toastify`, and `stripe-js`.

---

## Environment Variables Configuration

Create a `.env` file in the root of the client directory:

```env
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
