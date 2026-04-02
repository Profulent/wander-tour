/* ─────────────────────────────────────────────
   WANDER — main.js
   Handles: custom cursor, scroll effects,
   counter animations, IntersectionObserver
   reveals, API fetching, search/filter,
   modal, newsletter, toast notifications
───────────────────────────────────────────── */

const API = "/api";

/* ─────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showToast(msg, type = "success") {
  const t = $("#toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => { t.className = "toast"; }, 3800);
}

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
(function initCursor() {
  const cursor = $("#cursor");
  const follower = $("#cursorFollower");
  if (!cursor || window.innerWidth <= 1024) return;

  let fx = 0, fy = 0, lx = 0, ly = 0;
  document.addEventListener("mousemove", (e) => {
    fx = e.clientX; fy = e.clientY;
    cursor.style.left = fx + "px";
    cursor.style.top = fy + "px";
  });

  (function raf() {
    lx += (fx - lx) * 0.12;
    ly += (fy - ly) * 0.12;
    follower.style.left = lx + "px";
    follower.style.top = ly + "px";
    requestAnimationFrame(raf);
  })();

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, .dest-card, .exp-card, .filter-tab")) {
      cursor.classList.add("hover");
      follower.classList.add("hover");
    }
  });
  document.addEventListener("mouseout", () => {
    cursor.classList.remove("hover");
    follower.classList.remove("hover");
  });
  document.addEventListener("mousedown", () => { cursor.style.transform = "translate(-50%,-50%) scale(0.7)"; });
  document.addEventListener("mouseup", () => { cursor.style.transform = ""; });
})();

/* ─────────────────────────────────────────────
   NAVBAR — scroll shrink
───────────────────────────────────────────── */
(function initNav() {
  const nav = $("#navbar");
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobileMenu");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  $$(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    }
  });
})();

/* ─────────────────────────────────────────────
   HERO PARTICLES
───────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.createElement("canvas");
  const container = $("#particles");
  if (!container) return;
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const count = window.innerWidth <= 768 ? 20 : 45;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,112,74,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────
   PARALLAX on hero mosaic
───────────────────────────────────────────── */
(function initParallax() {
  const items = $$("[data-parallax]");
  if (!items.length || window.innerWidth <= 768) return;
  window.addEventListener("scroll", () => {
    const sy = window.scrollY;
    items.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax);
      el.style.transform = `translateY(${sy * speed}px)`;
    });
  });
})();

/* ─────────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────── */
function animateCounters() {
  $$(".stat-num").forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const isDecimal = el.dataset.decimal === "true";
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = target * ease;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER — scroll reveals
───────────────────────────────────────────── */
(function initReveal() {
  let statsAnimated = false;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  function observe() {
    $$(".reveal-up, .reveal-left, .reveal-right").forEach((el) => revealObserver.observe(el));
    const stats = $("#heroStats");
    if (stats) statsObserver.observe(stats);
  }

  // Run once DOM settles
  observe();
  // Re-observe after dynamic content loads
  window._reobserve = observe;
})();

function observeCards() {
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 80);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  $$(".dest-card.reveal-card").forEach((el) => cardObserver.observe(el));
}

/* ─────────────────────────────────────────────
   DESTINATION CARDS — render
───────────────────────────────────────────── */
function renderDestinations(dests) {
  const grid = $("#destGrid");
  const count = $("#resultsCount");

  if (!dests.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🗺️</div>
        <h3>No destinations found</h3>
        <p>Try adjusting your search or filters</p>
      </div>`;
    count.textContent = "";
    return;
  }

  count.textContent = `${dests.length} destination${dests.length !== 1 ? "s" : ""} found`;

  grid.innerHTML = dests
    .map((d, i) => {
      const isLarge = i === 0;
      return `
      <div class="dest-card ${isLarge ? "large" : ""} reveal-card"
           data-id="${d.id}" style="transition-delay:${i * 60}ms">
        <div class="bg" style="background-image:url('${d.image}')"></div>
        <div class="overlay"></div>
        <div class="dest-hover-detail">
          <div class="dest-hover-btn">View Details →</div>
        </div>
        <div class="info">
          <div class="dest-country">${d.flag} ${d.country}</div>
          <div class="dest-name">${d.name}</div>
          <div class="dest-meta">
            <span class="dest-rating">⭐ ${d.rating}</span>
            ${d.badge ? `<span class="dest-badge">${d.badge}</span>` : ""}
            <span class="dest-price">From $${d.price.toLocaleString()}</span>
          </div>
        </div>
      </div>`;
    })
    .join("");

  // Attach click → modal
  $$(".dest-card[data-id]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.id));
  });

  observeCards();
  if (window._reobserve) window._reobserve();
}

/* ─────────────────────────────────────────────
   FETCH DESTINATIONS
───────────────────────────────────────────── */
let currentCategory = "all";
let currentSort = "";
let currentSearch = "";
let debounceTimer;

async function fetchDestinations() {
  const grid = $("#destGrid");
  grid.innerHTML = Array(5).fill(0).map((_, i) =>
    `<div class="skeleton-card ${i === 0 ? "large" : ""}"></div>`
  ).join("");

  const params = new URLSearchParams();
  if (currentSearch) params.set("search", currentSearch);
  if (currentCategory !== "all") params.set("category", currentCategory);
  if (currentSort) params.set("sort", currentSort);

  try {
    const res = await fetch(`${API}/destinations?${params}`);
    if (!res.ok) throw new Error("Server error");
    const { data } = await res.json();
    renderDestinations(data);
  } catch (err) {
    console.warn("API unreachable, using fallback data:", err.message);
    // Fallback static data so site works without server
    renderDestinations(FALLBACK_DESTINATIONS.filter((d) => {
      const matchSearch = !currentSearch || d.name.toLowerCase().includes(currentSearch.toLowerCase()) || d.country.toLowerCase().includes(currentSearch.toLowerCase());
      const matchCat = currentCategory === "all" || d.category.includes(currentCategory);
      return matchSearch && matchCat;
    }));
  }
}

/* ─────────────────────────────────────────────
   SEARCH & FILTER
───────────────────────────────────────────── */
(function initFilters() {
  const searchInput = $("#searchInput");
  const searchClear = $("#searchClear");

  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim();
    searchClear.style.display = currentSearch ? "block" : "none";
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchDestinations, 380);
  });

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    currentSearch = "";
    searchClear.style.display = "none";
    fetchDestinations();
  });

  $$(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.cat;
      fetchDestinations();
    });
  });

  $("#sortSelect").addEventListener("change", (e) => {
    currentSort = e.target.value;
    fetchDestinations();
  });
})();

/* ─────────────────────────────────────────────
   EXPERIENCES — fetch & render
───────────────────────────────────────────── */
async function fetchExperiences() {
  const grid = $("#expGrid");
  try {
    const res = await fetch(`${API}/experiences`);
    if (!res.ok) throw new Error();
    const { data } = await res.json();
    renderExperiences(data);
  } catch {
    renderExperiences(FALLBACK_EXPERIENCES);
  }
}

function renderExperiences(exps) {
  const grid = $("#expGrid");
  grid.innerHTML = exps.map((e, i) => `
    <div class="exp-card reveal-up" style="transition-delay:${i * 80}ms">
      <div class="exp-icon">${e.icon}</div>
      <div class="exp-title">${e.title}</div>
      <div class="exp-desc">${e.description}</div>
      <div class="exp-num">${e.count} Experiences →</div>
    </div>
  `).join("");
  if (window._reobserve) window._reobserve();
}

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
async function openModal(id) {
  const overlay = $("#modalOverlay");
  const content = $("#modalContent");

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  content.innerHTML = `
    <div class="modal-hero" style="background:var(--sand);animation:shimmer 1.5s infinite;background-size:200% 100%;
      background-image:linear-gradient(90deg,var(--sand) 25%,var(--cream) 50%,var(--sand) 75%)"></div>
    <div class="modal-body"><p style="color:var(--muted)">Loading…</p></div>`;

  try {
    const res = await fetch(`${API}/destinations/${id}`);
    if (!res.ok) throw new Error();
    const { data: d } = await res.json();
    renderModal(d, content);
  } catch {
    const d = FALLBACK_DESTINATIONS.find((x) => x.id === parseInt(id));
    if (d) renderModal(d, content);
  }
}

function renderModal(d, content) {
  content.innerHTML = `
    <div class="modal-hero">
      <img src="${d.image}" alt="${d.name}" loading="lazy" />
    </div>
    <div class="modal-body">
      <div class="modal-country">${d.flag} ${d.country}</div>
      <div class="modal-name">${d.name}</div>
      <div class="modal-desc">${d.description}</div>
      <div class="modal-meta">
        <div class="modal-meta-item">
          <div class="modal-meta-label">Best Time</div>
          <div class="modal-meta-value">${d.bestTime}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">Duration</div>
          <div class="modal-meta-value">${d.duration}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">From</div>
          <div class="modal-meta-value">$${d.price.toLocaleString()}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-label">Rating</div>
          <div class="modal-meta-value">⭐ ${d.rating} (${d.reviews.toLocaleString()} reviews)</div>
        </div>
      </div>
      <div class="modal-highlights">
        <h4>Highlights</h4>
        <div class="highlight-list">
          ${d.highlights.map((h) => `<span class="highlight-chip">${h}</span>`).join("")}
        </div>
      </div>
      <button class="btn-primary" onclick="showToast('Booking coming soon! 🌍')">
        Book This Destination
      </button>
    </div>`;
}

(function initModal() {
  const overlay = $("#modalOverlay");
  const closeBtn = $("#modalClose");

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
})();

/* ─────────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────────── */
(function initNewsletter() {
  const form = $("#nlForm");
  const btn = $("#nlBtn");
  const msg = $("#nlMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#nlEmail").value.trim();
    btn.disabled = true;
    btn.textContent = "Subscribing…";
    msg.textContent = "";

    try {
      const res = await fetch(`${API}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        msg.textContent = "🎉 " + data.message;
        form.reset();
        showToast("Welcome to Wander! ✈️");
      } else {
        msg.textContent = data.message;
      }
    } catch {
      // Fallback if server is down
      msg.textContent = "🎉 You're subscribed! Welcome to Wander.";
      form.reset();
    } finally {
      btn.disabled = false;
      btn.textContent = "Subscribe";
    }
  });
})();

/* ─────────────────────────────────────────────
   STICKY SEARCH SHADOW
───────────────────────────────────────────── */
(function initSearchSticky() {
  const bar = $(".search-bar-section");
  if (!bar) return;
  const sentinel = document.createElement("div");
  bar.before(sentinel);
  new IntersectionObserver(([entry]) => {
    bar.classList.toggle("stuck", !entry.isIntersecting);
  }).observe(sentinel);
})();

/* ─────────────────────────────────────────────
   SMOOTH ANCHOR SCROLLS
───────────────────────────────────────────── */
$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ─────────────────────────────────────────────
   FALLBACK DATA (used when server is offline)
───────────────────────────────────────────── */
const FALLBACK_DESTINATIONS = [
  { id: 1, name: "Santorini", country: "Greece", flag: "🇬🇷", category: ["beach", "cultural", "romantic"], rating: 4.9, reviews: 3820, price: 1800, bestTime: "April – October", duration: "5–7 days", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800", badge: "Most Popular", description: "Iconic white-washed cycladic villages perched on volcanic cliffs above the deep blue Aegean.", highlights: ["Oia Sunset", "Caldera Cruise", "Wine Tasting", "Black Sand Beach"] },
  { id: 2, name: "Bali", country: "Indonesia", flag: "🇮🇩", category: ["beach", "cultural", "adventure", "wellness"], rating: 4.8, reviews: 5210, price: 950, bestTime: "April – October", duration: "7–10 days", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", badge: "Best Value", description: "A spiritual island of rice terraces, sacred temples, surf breaks, and extraordinary cuisine.", highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Mount Batur"] },
  { id: 3, name: "Machu Picchu", country: "Peru", flag: "🇵🇪", category: ["adventure", "cultural", "heritage"], rating: 4.9, reviews: 2980, price: 2200, bestTime: "May – September", duration: "4–6 days", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800", badge: "UNESCO Heritage", description: "The Lost City of the Incas sits 2,430m above sea level in the Andes.", highlights: ["Sun Gate Trek", "Huayna Picchu", "Inca Trail", "Sacred Valley"] },
  { id: 4, name: "Kyoto", country: "Japan", flag: "🇯🇵", category: ["cultural", "heritage", "wellness"], rating: 4.8, reviews: 4410, price: 1600, bestTime: "March – May", duration: "5–7 days", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800", badge: "Cultural Gem", description: "Japan's ancient capital, home to 1,600 Buddhist temples, golden pavilions, and bamboo groves.", highlights: ["Fushimi Inari", "Arashiyama Bamboo", "Kinkaku-ji", "Gion District"] },
  { id: 5, name: "Maldives", country: "Maldives", flag: "🇲🇻", category: ["beach", "romantic", "wellness"], rating: 4.9, reviews: 2150, price: 3800, bestTime: "November – April", duration: "6–8 days", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", badge: "Luxury Pick", description: "A scattered archipelago of 1,200 coral islands with turquoise lagoons and overwater bungalows.", highlights: ["Overwater Villas", "Snorkelling", "Bioluminescent Beach", "Whale Sharks"] },
  { id: 6, name: "Amalfi Coast", country: "Italy", flag: "🇮🇹", category: ["beach", "cultural", "romantic"], rating: 4.8, reviews: 3670, price: 2100, bestTime: "May – September", duration: "5–7 days", image: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=800", badge: null, description: "Dramatic cliffs draped in pastel villages plunging into the sparkling Tyrrhenian Sea.", highlights: ["Positano", "Path of the Gods", "Boat Tour", "Ravello Gardens"] },
  { id: 7, name: "Patagonia", country: "Argentina / Chile", flag: "🇦🇷", category: ["adventure"], rating: 4.9, reviews: 1830, price: 2600, bestTime: "November – March", duration: "10–14 days", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800", badge: "Wild & Remote", description: "Glaciers, granite towers, steppe, and fjords at the end of the world.", highlights: ["Torres del Paine", "Perito Moreno Glacier", "W Trek", "Puerto Natales"] },
  { id: 8, name: "Marrakech", country: "Morocco", flag: "🇲🇦", category: ["cultural", "heritage"], rating: 4.7, reviews: 4100, price: 900, bestTime: "March – May", duration: "4–6 days", image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800", badge: null, description: "A sensory explosion of spice-scented souks, ornate riads, and legendary squares.", highlights: ["Djemaa el-Fna", "Majorelle Garden", "Medina Souks", "Atlas Day Trip"] },
];

const FALLBACK_EXPERIENCES = [
  { id: 1, type: "adventure", icon: "🏔️", title: "Adventure", count: 48, description: "Trekking, climbing, and wild expeditions across the world's most remote terrain." },
  { id: 2, type: "cultural", icon: "🏛️", title: "Cultural", count: 63, description: "Immersive journeys into ancient history, local art, and living traditions." },
  { id: 3, type: "beach", icon: "🌊", title: "Beach & Coastal", count: 57, description: "Crystal waters, coral reefs, and sun-soaked coastlines." },
  { id: 4, type: "culinary", icon: "🍽️", title: "Culinary", count: 39, description: "Food tours, cooking classes, and market visits." },
  { id: 5, type: "wellness", icon: "🧘", title: "Wellness", count: 29, description: "Yoga retreats, spa sanctuaries, and mindful escapes." },
  { id: 6, type: "romantic", icon: "💫", title: "Romance", count: 34, description: "Honeymoon escapes and unforgettably intimate moments for two." },
];

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
fetchDestinations();
fetchExperiences();
