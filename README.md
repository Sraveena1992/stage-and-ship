# Fulfillment Flow - Warehouse Kanban

Live App: https://stage-and-ship.lovable.app

A Kanban board for e-commerce warehouse floor workers - designed for speed on warehouse floor.

**5 Columns:** Received | Picking | Packing | Staging | Shipped

### 🚀 NEW - Clickable KPIs (Hero Feature):
- **128 Today's Orders** - Click to show all orders
- **44 On The Board** - Click to show only active orders (hides Shipped)
- **9 Delayed** - Click to show only RUSH orders stuck >2 hrs (orange filter + Clear Filter banner)
- Active KPI turns blue ring + light blue background

### Features:
- **Each card:** Order ID (ORD-10042), Customer (Maya Patel), Priority RUSH (red badge), DELAYED (orange pulsing badge), BIN location (A-01-01), Product photo
- **Top Stats:** Today's Orders, On The Board, Delayed counter, SCAN BARCODE (big blue button with camera)
- **Unique 1:** Staging grouped by courier - BlueDart, Delhivery with 4 PM pickup time
- **Unique 2:** RUSH orders delayed >2 hours show orange DELAYED pulsing badge automatically
- **Usability:** Big buttons, simple UI for non-tech workers, localStorage persistence, drag-drop, search, Clear Filter

### Tech Stack:
React, TypeScript, Tailwind CSS, Lovable

### Run Locally:
```bash
git clone- https://github.com/Sraveena1992/stage-and-ship.git
cd stage-and-ship
npm install
npm run dev




