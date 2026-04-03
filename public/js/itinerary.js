const itineraryStops = [
  {
    name: "Rome",
    days: "Days 1-3",
    latlng: [41.9028, 12.4964],
    text: "Start with iconic landmarks, then slow down through neighborhood streets, aperitivo bars, and food tours in Trastevere.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop",
    highlights: [
      "Sunrise at the Colosseum and Roman Forum",
      "Vatican early-entry museum walk",
      "Chef-led pasta class in Trastevere",
    ],
  },
  {
    name: "Florence",
    days: "Days 4-6",
    latlng: [43.7696, 11.2558],
    text: "A slower rhythm built around Renaissance art, river walks, and a day through Tuscan vineyards and hill towns.",
    image: "https://images.unsplash.com/photo-1543429257-3eb0b65d2b1d?w=1200&auto=format&fit=crop",
    highlights: [
      "Uffizi and Duomo guided pass",
      "Sunset on Ponte Vecchio",
      "Chianti vineyard loop and lunch",
    ],
  },
  {
    name: "Cinque Terre",
    days: "Days 7-9",
    latlng: [44.1466, 9.654],
    text: "Coastal hiking paths, pastel harbor towns, and sea-facing trattorias with the freshest catches of the day.",
    image: "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?w=1200&auto=format&fit=crop",
    highlights: [
      "Village hopping by train and ferry",
      "Vernazza to Monterosso panoramic trek",
      "Golden-hour cliffside photo stop",
    ],
  },
  {
    name: "Amalfi Coast",
    days: "Days 10-14",
    latlng: [40.634, 14.6027],
    text: "Finish with dramatic coastal drives, Positano viewpoints, Ravello gardens, and a celebratory farewell dinner by the water.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop",
    highlights: [
      "Positano morning photo walk",
      "Boat day between hidden coves",
      "Ravello terrace sunset finale",
    ],
  },
];

const dayPlan = [
  { day: 1, title: "Arrive in Rome", transport: "Airport transfer", pace: "Easy", focus: ["Hotel check-in and neighborhood walk", "Sunset at Piazza Navona", "Welcome dinner near Pantheon"] },
  { day: 2, title: "Imperial Rome", transport: "Walking + metro", pace: "Moderate", focus: ["Colosseum and Roman Forum", "Capitoline Hill viewpoint", "Evening food crawl in Trastevere"] },
  { day: 3, title: "Vatican and Local Life", transport: "Walking + short taxi", pace: "Moderate", focus: ["Early Vatican Museums entry", "St. Peter's Basilica climb", "Free evening in Monti district"] },
  { day: 4, title: "Rome to Florence", transport: "High-speed train", pace: "Light", focus: ["Morning transfer to Florence", "Duomo and historic core walk", "Arno river sunset"] },
  { day: 5, title: "Renaissance Highlights", transport: "Walking", pace: "Moderate", focus: ["Uffizi guided session", "Accademia and David", "Tuscan steak dinner"] },
  { day: 6, title: "Tuscan Countryside", transport: "Private van day trip", pace: "Relaxed", focus: ["Chianti vineyards", "Siena old town stop", "Golden hour return to Florence"] },
  { day: 7, title: "Florence to Cinque Terre", transport: "Train connections", pace: "Light", focus: ["Scenic rail journey", "Check-in at seaside village", "Harbor promenade at dusk"] },
  { day: 8, title: "Villages and Trails", transport: "Train + hiking", pace: "Active", focus: ["Vernazza to Monterosso trail", "Focaccia tasting stop", "Sunset ferry return"] },
  { day: 9, title: "Coastal Leisure Day", transport: "Boat + walking", pace: "Relaxed", focus: ["Morning swim cove visit", "Photography walk in Manarola", "Seafood dinner with views"] },
  { day: 10, title: "Cinque Terre to Amalfi", transport: "Train + private transfer", pace: "Long transfer", focus: ["Travel south toward Amalfi", "Scenic coastal check-in", "Slow evening in Positano"] },
  { day: 11, title: "Positano and Amalfi", transport: "Boat shuttle", pace: "Relaxed", focus: ["Positano viewpoints", "Amalfi cathedral visit", "Beach club afternoon"] },
  { day: 12, title: "Ravello Gardens", transport: "Private driver", pace: "Easy", focus: ["Villa Rufolo and Villa Cimbrone", "Lemon grove tasting", "Live music courtyard evening"] },
  { day: 13, title: "Coastal Exploration", transport: "Boat charter", pace: "Flexible", focus: ["Hidden coves and grottoes", "Lunch in Nerano", "Final shopping and gelato stroll"] },
  { day: 14, title: "Farewell Italy", transport: "Departure transfer", pace: "Easy", focus: ["Late breakfast by the sea", "Airport or onward train departure", "Optional extension planning"] },
];

const stopItems = Array.from(document.querySelectorAll(".stop-item"));
const detailDays = document.getElementById("detailDays");
const detailTitle = document.getElementById("detailTitle");
const detailText = document.getElementById("detailText");
const detailImage = document.getElementById("detailImage");
const detailHighlights = document.getElementById("detailHighlights");
const dayAccordion = document.getElementById("dayAccordion");
const routeMapElement = document.getElementById("routeMap");

let selectedStopIndex = 0;
let travelerAnimationFrame = null;
let mapInstance;
let routePolyline;
let progressPolyline;
let travelerMarker;
let stopMarkers = [];
let travelerLatLng = null;
let imageRotationTimer = null;

function getRouteLatLngs() {
  return itineraryStops.map((stop) => stop.latlng);
}

function stopLatLng(index) {
  return itineraryStops[index]?.latlng || [0, 0];
}

function setStopMarkerStyles(index) {
  if (!stopMarkers || stopMarkers.length === 0) return;
  stopMarkers.forEach((marker, i) => {
    const isSelected = i === index;
    marker.setStyle({
      fillColor: isSelected ? "#cb7d56" : "#fffaf4",
    });
  });
}

function animateTravelerTo(targetLatLng) {
  if (!travelerMarker) return;

  if (travelerAnimationFrame) {
    cancelAnimationFrame(travelerAnimationFrame);
  }

  const start = travelerLatLng || L.latLng(stopLatLng(0));
  const target = L.latLng(targetLatLng);
  const duration = 900;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    travelerLatLng = L.latLng(
      start.lat + (target.lat - start.lat) * eased,
      start.lng + (target.lng - start.lng) * eased
    );
    travelerMarker.setLatLng(travelerLatLng);

    if (progress < 1) {
      travelerAnimationFrame = requestAnimationFrame(tick);
    } else {
      travelerAnimationFrame = null;
    }
  }

  travelerAnimationFrame = requestAnimationFrame(tick);
}

function setRouteProgressByIndex(index) {
  if (!progressPolyline) return;
  progressPolyline.setLatLngs(getRouteLatLngs().slice(0, index + 1));
  animateTravelerTo(stopLatLng(index));
}

function initRouteMap() {
  if (!window.L || !routeMapElement) return;

  const routeLatLngs = getRouteLatLngs();
  mapInstance = L.map(routeMapElement, {
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: true,
    attributionControl: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance);

  mapInstance.fitBounds(L.latLngBounds(routeLatLngs).pad(0.22));

  routePolyline = L.polyline(routeLatLngs, {
    color: "#4d6259",
    weight: 4,
    opacity: 0.35,
    lineCap: "round",
  }).addTo(mapInstance);

  progressPolyline = L.polyline([routeLatLngs[0]], {
    color: "#cb7d56",
    weight: 6,
    opacity: 0.95,
    lineCap: "round",
  }).addTo(mapInstance);

  travelerLatLng = L.latLng(routeLatLngs[0]);
  travelerMarker = L.circleMarker(travelerLatLng, {
    radius: 7,
    color: "#cb7d56",
    weight: 3,
    fillColor: "#fff7f0",
    fillOpacity: 1,
  }).addTo(mapInstance);

  stopMarkers = routeLatLngs.map((latlng, index) => {
    const marker = L.circleMarker(latlng, {
      radius: 8,
      color: "#cb7d56",
      weight: 3,
      fillColor: index === 0 ? "#cb7d56" : "#fffaf4",
      fillOpacity: 1,
    }).addTo(mapInstance);

    marker.on("click", () => renderStop(index));
    marker.on("mouseover", () => setRouteProgressByIndex(index));
    marker.on("mouseout", () => setRouteProgressByIndex(selectedStopIndex));
    return marker;
  });

  setStopMarkerStyles(0);
  setRouteProgressByIndex(0);
}

function renderStop(index) {
  const stop = itineraryStops[index];
  if (!stop) return;
  selectedStopIndex = index;

  if (imageRotationTimer) {
    clearInterval(imageRotationTimer);
    imageRotationTimer = null;
  }

  stopItems.forEach((item) => item.classList.toggle("active", Number(item.dataset.stop) === index));
  setStopMarkerStyles(index);

  detailDays.textContent = stop.days;
  detailTitle.textContent = stop.name;
  detailText.textContent = stop.text;
  detailImage.src = stop.image;
  detailImage.alt = stop.name;
  detailHighlights.innerHTML = stop.highlights.map((h) => `<li>${h}</li>`).join("");
  setRouteProgressByIndex(index);
}

stopItems.forEach((item) => {
  item.addEventListener("click", () => {
    renderStop(Number(item.dataset.stop));
  });
});
initRouteMap();
renderStop(0);

function initDayAccordion() {
  if (!dayAccordion) return;

  dayAccordion.innerHTML = dayPlan
    .map(
      (item) => `
      <article class="day-item ${item.day === 1 ? "open" : ""}">
        <button class="day-toggle" type="button" aria-expanded="${item.day === 1 ? "true" : "false"}">
          <span>
            <span class="day-label">Day ${item.day}</span>
            <span class="day-title">${item.title}</span>
          </span>
          <span class="day-chevron" aria-hidden="true"></span>
        </button>
        <div class="day-content" style="max-height:${item.day === 1 ? "280px" : "0"}">
          <div class="day-content-inner">
            <div class="day-meta">
              <span class="day-chip">Transport: ${item.transport}</span>
              <span class="day-chip">Pace: ${item.pace}</span>
            </div>
            <ul class="day-list">
              ${item.focus.map((point) => `<li>${point}</li>`).join("")}
            </ul>
          </div>
        </div>
      </article>`
    )
    .join("");

  const entries = Array.from(dayAccordion.querySelectorAll(".day-item"));

  entries.forEach((entry) => {
    const toggle = entry.querySelector(".day-toggle");
    const content = entry.querySelector(".day-content");

    toggle.addEventListener("click", () => {
      const isOpen = entry.classList.contains("open");

      entries.forEach((otherEntry) => {
        otherEntry.classList.remove("open");
        otherEntry.querySelector(".day-toggle").setAttribute("aria-expanded", "false");
        otherEntry.querySelector(".day-content").style.maxHeight = "0";
      });

      if (!isOpen) {
        entry.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

initDayAccordion();
