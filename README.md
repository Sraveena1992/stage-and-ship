# Fulfillment Flow - Warehouse Kanban

Live App: https://stage-and-ship.lovable.app

A Kanban board for e-commerce warehouse floor workers.

**5 Columns:** Received | Picking | Packing | Staging | Shipped

### Features:
- **Each card:** Order ID (ORD-10042), Customer, Priority RUSH (red), BIN location, Product photo
- **Top Stats:** Today's Orders 128, Delayed counter, SCAN BARCODE (big blue button)
- **Unique 1:** Staging grouped by courier - BlueDart, Delhivery with 4 PM pickup time
- **Unique 2:** RUSH orders delayed >2 hours show orange DELAYED pulsing badge
- **Usability:** Big, simple UI for non-tech workers, localStorage persistence, drag-drop, search

### Tech Stack:
React, TypeScript, Tailwind CSS, Lovable

### Run Locally:
```bash
git clone https://github.com/Sraveena1992/stage-and-ship.git
cd stage-and-ship
npm install
npm run dev
