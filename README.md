# Fulfillment Flow - Warehouse Kanban

**Warehouse Floor Board for End-to-End Order Fulfillment**

### 🔗 Live Demo
- **Live App:** [stage-ship-flow.lovable.app](https://stage-ship-flow.lovable.app)
- **Loom Demo (4 min):** [Watch Video Demo](https://www.loom.com/share/d548fa0077b642c398f0442f1ca2512c)

---

### 📦 Overview
Fulfillment Flow solves real warehouse problems of tracking 100+ daily orders across 5 stages. Floor staff can instantly see what is Received, what needs Picking, what is Delayed/RUSH, and scan barcodes to move orders seamlessly.

---

### ✨ Key Features (Built & Shown in Demo)

1. **5-Stage Kanban Board**
   - Workflow: `RECEIVED (11)` ➔ `PICKING (13)` ➔ `PACKING (11)` ➔ `STAGING (6)` ➔ `SHIPPED (9)`
   - Visual workflow with clear, color-coded columns.

2. **Clickable KPI Cards**
   - Metrics: **128** Today's Orders | **41** On The Board | **12** Delayed
   - Click on any KPI to filter the board instantly (e.g., click **DELAYED** to see urgent orders).

3. **Smart Order Cards**
   - High-visibility cards displaying Order ID (`ORD-10004`), Customer Name (`Liam O'Connor`), Product (`Canvas Backpack`), BIN Location (`D-22-04`), Product Image, and `RUSH` / `DELAYED` tags.

4. **Order Detail Modal (Hero Feature)**
   - Click any order card to view complete context: Order Value (`₹2,898`), BIN, Barcode (`77001111`), Address, Email, and Timestamp.
   - **Quick Actions:** `CALL CUSTOMER`, `VIEW LOCATION`, and `MOVE TO NEXT STAGE`.

5. **Barcode Scanning Workflow**
   - **SCAN BARCODE** button in header for fast floor operations using handheld scanners.

6. **One-Click Stage Transitions**
   - Quick action buttons on each card to shift orders instantly across stages.

---

### 🛠 Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State/Storage:** LocalStorage
- **Platform & Hosting:** Lovable.dev
- **Version Control:** GitHub

---

### 🎯 Problem Solved
Warehouses waste valuable time locating delayed items. This board gives floor managers instant visibility—12 Delayed orders are highlighted in **RED**, RUSH orders are prioritized, and precise BIN locations guide pickers directly.

---

### 💻 Run Locally

```bash
# Clone the repository
git clone- https://github.com/Sraveena1992/stage-and-ship.git

# Navigate to project directory
cd stage-and-ship

# Install dependencies
npm install

# Start development server
npm run dev
