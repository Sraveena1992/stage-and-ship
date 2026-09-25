import imgHeadphones from "@/assets/product-headphones.png";
import imgSneakers from "@/assets/product-sneakers.png";
import imgBottle from "@/assets/product-bottle.png";
import imgBackpack from "@/assets/product-backpack.png";

export const STAGES = ["received", "picking", "packing", "staging", "shipped"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  received: "Received",
  picking: "Picking",
  packing: "Packing",
  staging: "Staging",
  shipped: "Shipped",
};

export interface Order {
  id: string; // ORD-10001
  barcode: string; // 8-digit code the "scanner" types
  customer: string;
  bin: string; // BIN: A-12-03
  product: string;
  photo: number; // index into PRODUCT_PHOTOS
  priority: "rush" | "standard";
  stage: Stage;
  delayed: boolean;
  courier: Courier;
  stageSince: number; // ms timestamp when order entered its current stage
}

export const COURIERS = ["Delhivery", "BlueDart", "UPS"] as const;
export type Courier = (typeof COURIERS)[number];
export const PICKUP_TIME = "4:00 PM";
const TWO_HOURS = 2 * 60 * 60 * 1000;

/** Seeded delay flag, or RUSH order waiting in Received for more than 2 hours. */
export function isOrderDelayed(o: Order, now = Date.now()): boolean {
  if (o.stage === "shipped") return false;
  return o.delayed || (o.priority === "rush" && o.stage === "received" && now - o.stageSince > TWO_HOURS);
}

export const PRODUCT_PHOTOS = [
  { src: imgHeadphones, name: "Wireless Headphones" },
  { src: imgSneakers, name: "Court Sneakers" },
  { src: imgBottle, name: "Steel Water Bottle" },
  { src: imgBackpack, name: "Canvas Backpack" },
];

const CUSTOMERS = [
  "Maya Patel", "Jonas Weber", "Aiko Tanaka", "Liam O'Connor", "Sofia Rossi",
  "Noah Kim", "Elena Petrova", "Marcus Johnson", "Priya Sharma", "Lucas Meyer",
  "Camila Souza", "Ethan Brooks", "Fatima Al-Sayed", "Grace Liu", "Hugo Laurent",
  "Isla MacLeod", "Diego Fernández", "Nina Andersen", "Omar Haddad", "Ruth Cohen",
  "Tomas Novak", "Yuki Sato", "Zara Ahmed", "Anna Kowalski", "Ben Carter",
  "Chloe Dubois", "David Adeyemi", "Emma Nilsson", "Felix Braun", "Gita Rao",
  "Henry Walker", "Ines Ortega", "Jack Murphy", "Keiko Yamamoto", "Lena Fischer",
  "Milan Horvat", "Nadia Karim", "Oscar Lindberg", "Paula Mendes", "Quinn Sullivan",
  "Rania Aziz", "Stefan Ionescu", "Tessa de Vries", "Umar Farouk", "Vera Sokolova",
  "Wesley Grant", "Xenia Vasquez", "Yosef Mizrahi", "Zoe Bennett", "Arjun Mehta",
];

const PRODUCTS = [
  "Wireless Headphones",
  "Court Sneakers",
  "Steel Water Bottle",
  "Canvas Backpack",
  "Studio Monitor Stand",
  "USB-C Dock Pro",
  "Desk Lamp Arc",
  "Travel Organizer",
];

const ZONES = ["A", "B", "C", "D"];

// Stage distribution across the 50 orders (matches the 5 columns).
const STAGE_SPLIT: Stage[] = [
  ...Array(14).fill("received"),
  ...Array(12).fill("picking"),
  ...Array(10).fill("packing"),
  ...Array(8).fill("staging"),
  ...Array(6).fill("shipped"),
] as Stage[];

const DELAYED_IDS = new Set([4, 9, 17, 21, 26, 33]); // exactly 6 delayed orders, none shipped
const RUSH_COUNT = 11;

export function buildDummyOrders(): Order[] {
  const now = Date.now();
  return Array.from({ length: 50 }, (_, i) => {
    const zone = ZONES[i % ZONES.length];
    const aisle = String((i * 7) % 24 + 1).padStart(2, "0");
    const level = String((i * 3) % 6 + 1).padStart(2, "0");
    return {
      id: `ORD-${10001 + i}`,
      barcode: String(77001000 + i * 37),
      customer: CUSTOMERS[i]!,
      bin: `${zone}-${aisle}-${level}`,
      product: PRODUCTS[i % PRODUCTS.length]!,
      photo: i % PRODUCT_PHOTOS.length,
      priority: i < RUSH_COUNT ? "rush" : "standard",
      stage: STAGE_SPLIT[i]!,
      delayed: DELAYED_IDS.has(i),
      courier: COURIERS[i % COURIERS.length]!,
      // some rush orders have been sitting in Received 2.5h+ so the warning shows
      stageSince: now - (i % 3 === 0 ? 150 + i * 5 : 20 + i * 3) * 60_000,
    };
  });
}
