require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ─────────────────────────────────────────────
   IN-MEMORY DATA
───────────────────────────────────────────── */
const destinations = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    flag: "🇬🇷",
    category: ["beach", "cultural", "romantic"],
    rating: 4.9,
    reviews: 3820,
    price: 1800,
    currency: "USD",
    duration: "5–7 days",
    bestTime: "April – October",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    featured: true,
    badge: "Most Popular",
    description:
      "Iconic white-washed cycladic villages perched on volcanic cliffs above the deep blue Aegean. Famous for sunsets, wine, and stunning caldera views.",
    highlights: ["Oia Sunset", "Caldera Cruise", "Wine Tasting", "Black Sand Beach"],
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    flag: "🇮🇩",
    category: ["beach", "cultural", "adventure", "wellness"],
    rating: 4.8,
    reviews: 5210,
    price: 950,
    currency: "USD",
    duration: "7–10 days",
    bestTime: "April – October",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    featured: true,
    badge: "Best Value",
    description:
      "A spiritual island of rice terraces, sacred temples, surf breaks, and extraordinary cuisine. Bali offers everything from jungle retreats to beach clubs.",
    highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Mount Batur"],
  },
  {
    id: 3,
    name: "Machu Picchu",
    country: "Peru",
    continent: "South America",
    flag: "🇵🇪",
    category: ["adventure", "cultural", "heritage"],
    rating: 4.9,
    reviews: 2980,
    price: 2200,
    currency: "USD",
    duration: "4–6 days",
    bestTime: "May – September",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800",
    featured: true,
    badge: "UNESCO Heritage",
    description:
      "The Lost City of the Incas sits 2,430m above sea level in the Andes. One of humanity's greatest architectural achievements, wrapped in cloud and mystery.",
    highlights: ["Sun Gate Trek", "Huayna Picchu", "Inca Trail", "Sacred Valley"],
  },
  {
    id: 4,
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    flag: "🇯🇵",
    category: ["cultural", "heritage", "wellness"],
    rating: 4.8,
    reviews: 4410,
    price: 1600,
    currency: "USD",
    duration: "5–7 days",
    bestTime: "March – May, Oct – Nov",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
    featured: true,
    badge: "Cultural Gem",
    description:
      "Japan's ancient capital, home to over 1,600 Buddhist temples, golden pavilions, bamboo groves, and the world's finest tea ceremony culture.",
    highlights: ["Fushimi Inari", "Arashiyama Bamboo", "Kinkaku-ji", "Gion District"],
  },
  {
    id: 5,
    name: "Maldives",
    country: "Maldives",
    continent: "Asia",
    flag: "🇲🇻",
    category: ["beach", "romantic", "wellness"],
    rating: 4.9,
    reviews: 2150,
    price: 3800,
    currency: "USD",
    duration: "6–8 days",
    bestTime: "November – April",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    featured: true,
    badge: "Luxury Pick",
    description:
      "A scattered archipelago of 1,200 coral islands with turquoise lagoons, overwater bungalows, and some of the world's best diving and snorkelling.",
    highlights: ["Overwater Villas", "Snorkelling", "Bioluminescent Beach", "Whale Sharks"],
  },
  {
    id: 6,
    name: "Amalfi Coast",
    country: "Italy",
    continent: "Europe",
    flag: "🇮🇹",
    category: ["beach", "cultural", "romantic"],
    rating: 4.8,
    reviews: 3670,
    price: 2100,
    currency: "USD",
    duration: "5–7 days",
    bestTime: "May – September",
    image: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=800",
    featured: false,
    badge: null,
    description:
      "Dramatic cliffs draped in pastel villages plunging into the sparkling Tyrrhenian Sea. Positano, Ravello, and Amalfi are among Italy's most spectacular towns.",
    highlights: ["Positano", "Path of the Gods", "Boat Tour", "Ravello Gardens"],
  },
  {
    id: 7,
    name: "Patagonia",
    country: "Argentina / Chile",
    continent: "South America",
    flag: "🇦🇷",
    category: ["adventure"],
    rating: 4.9,
    reviews: 1830,
    price: 2600,
    currency: "USD",
    duration: "10–14 days",
    bestTime: "November – March",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    featured: false,
    badge: "Wild & Remote",
    description:
      "The end of the world. Glaciers, granite towers, steppe, and fjords. Torres del Paine is one of the most dramatic trekking destinations on Earth.",
    highlights: ["Torres del Paine", "Perito Moreno Glacier", "W Trek", "Puerto Natales"],
  },
  {
    id: 8,
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    flag: "🇲🇦",
    category: ["cultural", "heritage"],
    rating: 4.7,
    reviews: 4100,
    price: 900,
    currency: "USD",
    duration: "4–6 days",
    bestTime: "March – May, Sep – Nov",
    image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800",
    featured: false,
    badge: null,
    description:
      "A sensory explosion of spice-scented souks, ornate riads, rooftop terraces, and the legendary Djemaa el-Fna square pulsing with life after dark.",
    highlights: ["Djemaa el-Fna", "Majorelle Garden", "Medina Souks", "Atlas Day Trip"],
  },
];

const experiences = [
  { id: 1, type: "adventure", icon: "🏔️", title: "Adventure", count: 48, description: "Trekking, climbing, and wild expeditions across the world's most remote terrain." },
  { id: 2, type: "cultural", icon: "🏛️", title: "Cultural", count: 63, description: "Immersive journeys into ancient history, local art, and living traditions." },
  { id: 3, type: "beach", icon: "🌊", title: "Beach & Coastal", count: 57, description: "Crystal waters, coral reefs, and sun-soaked coastlines that take your breath away." },
  { id: 4, type: "culinary", icon: "🍽️", title: "Culinary", count: 39, description: "Food tours, cooking classes, and market visits that reveal the soul of a place." },
  { id: 5, type: "wellness", icon: "🧘", title: "Wellness", count: 29, description: "Yoga retreats, spa sanctuaries, and mindful escapes in serene natural settings." },
  { id: 6, type: "romantic", icon: "💫", title: "Romance", count: 34, description: "Honeymoon escapes, sunset cruises, and unforgettably intimate moments for two." },
];

const subscribers = [];

/* ─────────────────────────────────────────────
   API ROUTES
───────────────────────────────────────────── */

// GET /api/destinations
// Query params: search, category, continent, featured, sort (price_asc, price_desc, rating, popular)
app.get("/api/destinations", (req, res) => {
  let results = [...destinations];
  const { search, category, continent, featured, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }
  if (category && category !== "all") {
    results = results.filter((d) => d.category.includes(category));
  }
  if (continent) {
    results = results.filter((d) => d.continent.toLowerCase() === continent.toLowerCase());
  }
  if (featured === "true") {
    results = results.filter((d) => d.featured);
  }
  if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
  else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  else if (sort === "popular") results.sort((a, b) => b.reviews - a.reviews);

  res.json({ success: true, count: results.length, data: results });
});

// GET /api/destinations/:id
app.get("/api/destinations/:id", (req, res) => {
  const dest = destinations.find((d) => d.id === parseInt(req.params.id));
  if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });
  res.json({ success: true, data: dest });
});

// GET /api/experiences
app.get("/api/experiences", (req, res) => {
  res.json({ success: true, data: experiences });
});

// POST /api/newsletter
app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Please provide a valid email address." });
  }
  if (subscribers.includes(email)) {
    return res.status(409).json({ success: false, message: "This email is already subscribed!" });
  }
  subscribers.push(email);
  console.log(`New subscriber: ${email}`);
  res.json({ success: true, message: "You're subscribed! Welcome to Wander. 🌍" });
});

// GET /api/stats
app.get("/api/stats", (req, res) => {
  res.json({
    success: true,
    data: {
      destinations: 250,
      travellers: 84000,
      rating: 4.9,
      countries: 68,
    },
  });
});

/* ─────────────────────────────────────────────
   CATCH-ALL → serve index.html
───────────────────────────────────────────── */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🌍 Wander server running at http://localhost:${PORT}`);
  console.log(`📦 API available at http://localhost:${PORT}/api`);
  console.log(`✅ Press Ctrl+C to stop\n`);
});
