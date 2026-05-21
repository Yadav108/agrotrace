# 🌿 AgroTrace
### Farm to Table — Every Step Traced

> A supply chain transparency platform for Indian agriculture. Built to eliminate middlemen opacity, give farmers fair prices, and let buyers verify every batch of produce end-to-end.

---

## The Problem

India has ~150 million farmers. Most sell through middlemen at mandis. A farmer earns ₹10/kg for tomatoes. The consumer pays ₹60/kg. **The middle eats 80% of the value** — with zero visibility into where produce is, who touched it, or why it spoiled.

AgroTrace gives farmers, buyers, and transporters a single source of truth — live, traceable, and verifiable.

---

## Features

### 🌾 Farmer
- List produce batches with crop type, variety, quantity, price, and harvest date
- Auto-generated batch codes (e.g. `TOM-2026-0003`)
- Track orders placed against each batch
- View remaining stock in real time

### 🛒 Buyer
- Browse verified produce listings directly from farmers
- Place orders with live total cost calculation
- Track incoming shipments via batch code
- View full order history

### 🚛 Transporter
- Log shipment events at each checkpoint (dispatch, transit, delivery)
- Record temperature and humidity conditions per event
- View full event log history

### 🔍 Trace Page (Public)
- Enter any batch code to see the complete supply chain journey
- Interactive map (Leaflet.js) with route polyline across India
- Timeline of every event — actor, location, timestamp, sensor data
- No login required — full transparency for anyone

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | NextAuth.js v5 (credentials, role-based) |
| ORM | Prisma |
| Database | SQLite (local, `dev.db`) |
| Maps | Leaflet.js + react-leaflet |
| Charts | Recharts |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/agrotrace.git
cd agrotrace

# Install dependencies
npm install

# Set up the database
npx prisma db push

# Seed with demo data
npx prisma db seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Prisma Studio (DB viewer): `npx prisma studio` → [http://localhost:5555](http://localhost:5555)

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| 🌾 Farmer | rajesh@agrotrace.in | farmer123 |
| 🛒 Buyer | prashant@agrotrace.in | buyer123 |
| 🚛 Transporter | fastmove@agrotrace.in | transport123 |

---

## Demo Flow (2 minutes)

1. **Landing page** → `localhost:3000` — understand the problem
2. **Trace a batch** → enter `WHT-2026-0001` — see the full Amritsar → Delhi journey on the map
3. **Login as Farmer** → add a new produce batch
4. **Login as Buyer** → place an order on available produce
5. **Login as Transporter** → log a checkpoint event
6. **Trace again** → the new event appears in the timeline live

---

## Project Structure

```
agrotrace/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page with role selector
│   │   └── register/       # Register page with role selector
│   ├── (dashboard)/
│   │   ├── farmer/         # Farmer dashboard
│   │   ├── buyer/          # Buyer dashboard
│   │   └── transporter/    # Transporter dashboard
│   ├── trace/              # Public batch trace page
│   ├── api/
│   │   ├── auth/           # NextAuth handler
│   │   ├── batches/        # Batch creation API
│   │   ├── orders/         # Order placement API
│   │   ├── events/         # Shipment event API
│   │   └── trace/          # Trace data API
│   ├── layout.tsx
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── trace/              # TraceMap, TraceSearch
│   └── navbar.tsx
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Demo seed data
└── README.md
```

---

## Database Schema (Core Models)

```
User         → id, name, email, password (bcrypt), role (FARMER/BUYER/TRANSPORTER)
Batch        → id, batchCode, cropType, variety, quantityKg, pricePerKg, status, farmerId
ShipmentEvent → id, batchId, actorId, eventType, locationName, lat, lon, timestamp, temperature?, humidity?
Order        → id, batchId, buyerId, quantityOrdered, price, status
```

`remainingKg` is always **derived** at query time:
```
remainingKg = batch.quantityKg - SUM(orders.quantityOrdered WHERE status != CANCELLED)
```

---

## Key Design Decisions

**Why SQLite?** Zero setup, single file, runs locally without any cloud dependency. Perfect for a demo environment.

**Why derived remainingKg?** Storing it creates a race condition — two buyers reading simultaneously both see the same value and both succeed, causing overselling. Computing it from orders at query time is always consistent.

**Why role-based auth at login?** Allows the same email to be unambiguous about intent, and enables clean redirects to role-specific dashboards post-login.

**Why Leaflet over Google Maps?** No API key required. Works fully offline. Critical for a local demo environment.

---

## Problem Context

| Metric | Reality |
|---|---|
| Farmers' share of retail price | 15–20% |
| Post-harvest loss in India | ~40% |
| Farmers with direct buyer access | <5% |
| Mandi intermediary layers | 3–5 per transaction |

---

## Built With

This project was built as a university submission exploring how software can address structural inefficiencies in Indian agricultural supply chains.

**Stack:** Next.js · Prisma · SQLite · NextAuth · Tailwind CSS · shadcn/ui · Leaflet.js · Recharts
