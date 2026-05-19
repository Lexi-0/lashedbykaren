# Lash'd by Karen

Booking website for a lash studio. Clients can browse services, pick a date and time, and submit their details. Bookings are saved to Supabase and viewable in a password-protected admin dashboard.

---

## File Structure

```
lashedbykaren/
├── index.html        # Main booking site
├── styles.css        # All styles
├── main.js           # Booking logic, Supabase integration
├── admin.html        # Admin dashboard (password protected)
├── README.md
└── images/           # All site images
    ├── classic.jpg
    ├── hybrid.jpg
    └── ...
```

---

## Stack

- Plain HTML, CSS, JavaScript — no frameworks, no build step
- [Supabase](https://supabase.com) for the database
- [Vercel](https://vercel.com) for hosting

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/lashedbykaren.git
cd lashedbykaren
```

### 2. Supabase

The project uses Supabase as the backend database.

1. Go to [supabase.com](https://supabase.com) and create a project
2. Create a table called `bookings` with these columns:

| Column | Type |
|---|---|
| `id` | text (primary key) |
| `client_name` | text |
| `phone` | text |
| `hostel` | text |
| `room` | text |
| `service` | text |
| `addons` | text |
| `price` | int8 |
| `date` | text |
| `time` | text |
| `notes` | text |
| `status` | text (default: `pending`) |
| `created_at` | timestamptz (default: `now()`) |

3. Enable RLS and add these 3 policies on the `bookings` table:

**Allow reads**
```sql
create policy "Allow reads" on "public"."bookings"
as PERMISSIVE for SELECT to public using (true);
```

**Allow inserts**
```sql
create policy "Allow inserts" on "public"."bookings"
as PERMISSIVE for INSERT to public with check (true);
```

**Allow all**
```sql
create policy "Allow all" on "public"."bookings"
as PERMISSIVE for ALL to public using (true);
```

4. Go to **Project Settings → API** and copy your Project URL and anon key into `main.js` and `admin.html`:

```js
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
```

### 3. Deploy to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select the repo → Deploy (no configuration needed)

Your site will be live at `yourproject.vercel.app`  
Admin dashboard at `yourproject.vercel.app/admin.html`

---

## Admin Dashboard

Protected by a password. Default is  — change it at the top of `admin.html`:

```js
const ADMIN_PASSWORD = '';
```

Features:
- See all bookings with client name, phone, hostel, room, service, date and time
- Filter by status (Pending / Confirmed / Done)
- Search by name, room or hostel
- Mark bookings as confirmed or done
- Delete individual bookings or clear all

---

## Changing Services or Prices

Services are defined in `main.js` near the top. Find the `SERVICES` array and edit names, descriptions, prices and durations there.

---

## Changing the Admin Password

Open `admin.html` and change this line:

```js
const ADMIN_PASSWORD = '';
```
