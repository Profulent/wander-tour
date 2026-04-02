# 🌍 Wander — Tourist Destination Website

A fully responsive travel destination website with an Express.js backend, scroll animations, live search/filtering, and a modal detail view.

---

## 🚀 Quick Start

### 1. Open in VSCode
```bash
# Clone or extract the folder, then:
code wander-travel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the server
```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

> Requires Node.js v16+. Install nodemon globally if needed: `npm install -g nodemon`

### 4. Open in browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
wander-travel/
├── server.js           # Express backend — all API routes
├── package.json        # Dependencies & scripts
├── .env                # PORT and environment config
├── public/
│   ├── index.html      # Main HTML page
│   ├── css/
│   │   └── style.css   # All styles + responsive breakpoints
│   └── js/
│       └── main.js     # Animations, API calls, all interactions
└── README.md           # This file
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | All destinations (supports query params) |
| GET | `/api/destinations/:id` | Single destination detail |
| GET | `/api/experiences` | All experience types |
| GET | `/api/stats` | Site-wide stats |
| POST | `/api/newsletter` | Subscribe with email |

### Query Params for `/api/destinations`
| Param | Values | Example |
|-------|--------|---------|
| `search` | any string | `?search=bali` |
| `category` | beach, adventure, cultural, romantic, wellness, heritage | `?category=beach` |
| `continent` | Asia, Europe, Africa, South America | `?continent=Asia` |
| `featured` | true | `?featured=true` |
| `sort` | rating, popular, price_asc, price_desc | `?sort=rating` |

---

## ✨ Features

- **Responsive** — mobile-first, tested at 480 / 768 / 1024 / 1200px+
- **Custom cursor** with magnetic hover effect (desktop only)
- **Particle canvas** on hero background
- **Parallax** on hero images
- **Scroll reveal** animations (IntersectionObserver)
- **Animated counters** on stats
- **Live search** with 380ms debounce
- **Category filter tabs** + sort dropdown
- **Skeleton loading** while API fetches
- **Destination modal** with full details
- **Newsletter** with POST to backend
- **Toast notifications** for user feedback
- **Floating itinerary badge** animation
- **Hamburger mobile menu** with slide-in drawer
- **Fallback data** — site works even if server is offline

---

## 🛠 Extending / Customising

### Add a new destination
In `server.js`, add an object to the `destinations` array:
```js
{
  id: 9,
  name: "Petra",
  country: "Jordan",
  flag: "🇯🇴",
  category: ["cultural", "adventure", "heritage"],
  rating: 4.8,
  reviews: 2100,
  price: 1400,
  currency: "USD",
  duration: "3–5 days",
  bestTime: "March – May",
  image: "https://...",
  featured: false,
  badge: null,
  description: "...",
  highlights: ["Treasury", "Siq Canyon", "Monastery", "Wadi Rum"],
}
```

### Connect a real database
Replace the in-memory arrays in `server.js` with your DB queries. The route handlers are already async-ready. Suggested choices:
- **MongoDB** — `npm install mongoose`
- **PostgreSQL** — `npm install pg`
- **SQLite** — `npm install better-sqlite3`

### Add authentication
Install `jsonwebtoken` and `bcrypt`, add a `POST /api/auth/login` route, and protect any routes with a middleware function.

### Deploy
- **Railway / Render** — push to GitHub, connect repo, set `PORT` env var
- **Vercel** — add a `vercel.json` with `{ "builds": [{ "src": "server.js", "use": "@vercel/node" }] }`

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server & routing |
| `cors` | Cross-Origin Resource Sharing |
| `dotenv` | Environment variable loading |
| `nodemon` (dev) | Auto-restart on file changes |

---

## 🎨 Design Tokens (CSS Variables)

```css
--cream: #F7F3ED       /* page background */
--sand: #E8DDD0        /* borders, dividers */
--terracotta: #C4704A  /* primary accent */
--rust: #A0522D        /* hover accent */
--deep: #1C1814        /* headings, dark bg */
--mid: #4A3F35         /* body text */
--muted: #8A7D72       /* secondary text */
--accent: #2E6B5E      /* green accent */
```

---

Made with ❤️ — ready to extend with a real DB, auth, and booking system.
