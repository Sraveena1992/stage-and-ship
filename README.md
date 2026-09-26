# Fulfillment Flow - Warehouse Kanban

**Live App:** https://stage-ship-flow.lovable.app  
**GitHub:** https://github.com/Sraveena1992/stage-and-ship

A Kanban board for e-commerce warehouse floor workers - designed for speed on the warehouse floor.

### 5 Columns: Received | Picking | Packing | Staging | Shipped

### 🚀 NEW - Clickable KPIs (Hero Feature):
- **128 Today's Orders:** Click to show all orders
- **44 On The Board:** Click to show only active orders (hides Shipped)
- **9 Delayed:** Click to show only RUSH orders stuck >2 hrs (orange filter + Clear Filter banner)
- Active KPI turns blue ring + light blue background

### 💳 NEW - Clickable Order Detail Modal:
- Click any Order ID (e.g., ORD-10001 / Maya Patel) opens customer detail window
- Shows: Phone (+91), Email, Address, Order Value in ₹ (₹1,261), Product, BIN, Courier (UPS/BlueDart), Stage, Barcode
- Actions: CALL CUSTOMER, VIEW LOCATION, MOVE TO NEXT STAGE
- Fixed: Handles old localStorage orders gracefully

### Features:
- **Each card:** Order ID, Customer, Priority RUSH (red badge), DELAYED (orange pulsing), BIN location (A-01-01), Product photo
- **Top Stats:** Today's Orders, On The Board, Delayed counter, SCAN BARCODE
- **Search:** Search by Order ID or Customer name
- **Staging:** Grouped by courier - BlueDart, Delhivery with 4 PM pickup time

### Tech Stack:
React + TypeScript + Tailwind CSS + Lovable + LocalStorage

### Run Locally:
```bash
git clone- https://github.com/Sraveena1992/stage-and-ship.git
cd stage-and-ship
npm install
npm run dev
