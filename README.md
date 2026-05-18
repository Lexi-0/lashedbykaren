# ✨ Lash Studio — Website & Booking System

A premium lash studio website with a full booking flow and digital ticket system.

---

## 📁 File Structure

```
lash-studio/
├── index.html              ← Main website (all pages in one)
├── css/
│   └── styles.css          ← All styles + design system
├── js/
│   └── main.js             ← Frontend logic, booking flow, ticket
├── backend/
│   ├── api.js              ← Express + Supabase REST API
│   └── schema.sql          ← Database schema + seed data
└── package.json
```

---

## 🚀 Frontend Setup

No build step needed. Just open `index.html` in a browser, or serve with:

```bash
npx serve .
```

---

## 🗄️ Backend Setup

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com) and create a new project
- Copy your **Project URL** and **Service Role Key** from Settings → API

### 2. Run the Database Schema
- Go to Supabase → SQL Editor
- Paste and run the contents of `backend/schema.sql`
- This creates all tables, policies, indexes, and seeds 90 days of availability

### 3. Configure Environment
Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3001
FRONTEND_URL=http://localhost:3000

# Optional: email confirmations
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=studio@yourlashstudio.com
```

### 4. Install & Start
```bash
npm install
npm start
# or for development with auto-reload:
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| GET | `/api/availability?date=YYYY-MM-DD` | Available slots for a date |
| POST | `/api/bookings` | Create a booking + send ticket |
| GET | `/api/bookings/:id` | Get booking + QR code |
| GET | `/api/verify?booking=LS-XXXXX` | Verify a booking (QR scan) |
| PATCH | `/api/bookings/:id/status` | Update booking status (admin) |
| GET | `/api/admin/bookings` | List all bookings (admin) |
| POST | `/api/admin/availability/block` | Block dates/slots (admin) |
| POST | `/api/admin/availability/unblock` | Unblock a slot (admin) |

---

## 🎟️ Ticket System

When a booking is submitted:
1. A unique booking number (`LS-XXXXXX`) is generated
2. The booking is saved to Supabase
3. The time slot is marked as booked in the availability table
4. A QR code is generated linking to `/verify?booking=LS-XXXXX`
5. A beautiful HTML email ticket is sent (if email provided)
6. An animated digital ticket appears on screen

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--dusty-pink` | `#E8C5BF` | Accents, borders |
| `--rose-blush` | `#D4A5A0` | Hover states |
| `--deep-rose` | `#B07A75` | Primary actions |
| `--ivory` | `#FAF7F2` | Page background |
| `--charcoal` | `#2C2826` | Text, dark sections |

Fonts: **Cormorant Garamond** (display) + **Jost** (body)

---

## 📱 Responsive

The site adapts to all screen sizes:
- Mobile: single-column, collapsible nav, large touch targets
- Tablet: 2-column layouts, condensed hero
- Desktop: full two-panel hero, masonry gallery

---

## 🔧 Customisation Checklist

- [ ] Replace placeholder service images in `service-card-image` divs
- [ ] Add real gallery photos to `.gallery-item` divs
- [ ] Update studio name, address, hours, Instagram handle
- [ ] Connect frontend booking form to the backend API
- [ ] Add Google Maps embed in the contact section
- [ ] Set up SMTP credentials for email tickets
- [ ] Configure Supabase RLS for production security
