import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Barcode, Search, X } from "lucide-react";
import { COURIERS, PICKUP_TIME, STAGES, STAGE_LABELS, isOrderDelayed, type Order, type Stage } from "@/data/orders";
import IssueLog from "@/components/IssueLog";
import { useOrders } from "@/hooks/use-orders";
import OrderCard from "@/components/OrderCard";
import ScanModal from "@/components/ScanModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fulfillment Hub — Warehouse Order Board" },
      {
        name: "description",
        content:
          "Warehouse fulfillment board: track orders across Received, Picking, Packing, Staging and Shipped, scan barcodes and spot delayed orders fast.",
      },
      { property: "og:title", content: "Fulfillment Hub — Warehouse Order Board" },
      {
        property: "og:description",
        content:
          "Track every order from Received to Shipped with a big, simple board built for the warehouse floor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const COLUMN_ACCENT: Record<Stage, { bar: string; chip: string; text: string }> = {
  received: { bar: "bg-stage-received", chip: "bg-stage-received", text: "text-stage-received" },
  picking: { bar: "bg-stage-picking", chip: "bg-stage-picking", text: "text-stage-picking" },
  packing: { bar: "bg-stage-packing", chip: "bg-stage-packing", text: "text-stage-packing" },
  staging: { bar: "bg-stage-staging", chip: "bg-stage-staging", text: "text-stage-staging" },
  shipped: { bar: "bg-stage-shipped", chip: "bg-stage-shipped", text: "text-stage-shipped" },
};

const COURIER_ACCENT = {
  BlueDart: "border-courier-bluedart/40 bg-courier-bluedart text-primary-foreground",
  Delhivery: "border-courier-delhivery/40 bg-courier-delhivery text-delayed-foreground",
  UPS: "border-courier-ups/40 bg-courier-ups text-primary-foreground",
} as const;

function Index() {
  const { orders, moveOrder, advanceOrder, findOrder, resetDay } = useOrders();
  const [scanOpen, setScanOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Stage | null>(null);
  const [search, setSearch] = useState("");

  const todaysOrders = 128; // daily intake stat, per warehouse display spec
  const delayedCount = orders.filter((o) => isOrderDelayed(o)).length;
  const inProgress = orders.filter((o) => o.stage !== "shipped").length;
  const normalizedSearch = search.trim().toLowerCase();
  const visibleOrders = normalizedSearch
    ? orders.filter(
        (order) =>
          order.id.toLowerCase().includes(normalizedSearch) ||
          order.customer.toLowerCase().includes(normalizedSearch),
      )
    : orders;

  const handleScan = (code: string) => {
    const order = findOrder(code);
    if (!order) return undefined;
    const updated = advanceOrder(order.id);
    if (updated) {
      setFlashId(updated.id);
      setTimeout(() => setFlashId((f) => (f === updated.id ? null : f)), 3500);
    }
    return updated;
  };

  const handleDrop = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) moveOrder(id, stage);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-foreground" aria-hidden>
              📦
            </div>
            <div>
              <h1 className="stage-headline text-2xl leading-tight text-foreground">
                Fulfillment Hub
              </h1>
              <p className="text-sm font-medium text-muted-foreground">Warehouse Floor Board</p>
            </div>
          </div>

          <div className="order-last flex w-full items-center gap-2 xl:order-none xl:ml-auto xl:w-[340px]">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Order ID or Customer"
                aria-label="Search Order ID or Customer"
                className="h-12 rounded-xl border-2 bg-background pl-12 pr-11 text-base font-semibold md:text-base"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearch("")}
                  className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg"
                  aria-label="Clear search"
                >
                  <X className="size-5" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Stat label="Today's Orders" value={todaysOrders} tone="text-primary" />
            <Stat label="On the Board" value={inProgress} tone="text-foreground" />
            <Stat
              label="Delayed"
              value={delayedCount}
              tone={delayedCount > 0 ? "text-rush" : "text-muted-foreground"}
              alert={delayedCount > 0}
            />
            <Button
              onClick={() => setScanOpen(true)}
              className="h-auto rounded-2xl px-7 py-4 shadow-lg shadow-primary/30 active:scale-[0.98]"
            >
              <Barcode className="size-8" aria-hidden />
              <span className="text-xl font-extrabold uppercase tracking-wide">
                Scan Barcode
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban board */}
      <main className="mx-auto max-w-[1800px] px-5 py-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STAGES.map((stage) => {
            const totalColumnCount = orders.filter((o) => o.stage === stage).length;
            const columnOrders = visibleOrders.filter((o) => o.stage === stage);
            const rushCount = columnOrders.filter((o) => o.priority === "rush").length;
            const accent = COLUMN_ACCENT[stage];
            return (
              <section
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(stage);
                }}
                onDragLeave={() => setDragOver((d) => (d === stage ? null : d))}
                onDrop={(e) => handleDrop(e, stage)}
                className={`flex min-h-[70vh] flex-col rounded-3xl border-2 bg-secondary/50 p-3 transition-colors ${
                  dragOver === stage ? "border-primary bg-primary/5" : "border-transparent"
                }`}
                aria-label={`${STAGE_LABELS[stage]} column, ${columnOrders.length} orders`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-8 w-2 rounded-full ${accent.bar}`} aria-hidden />
                  <h2 className={`stage-headline text-lg ${accent.text}`}>
                    {STAGE_LABELS[stage]} ({totalColumnCount})
                  </h2>
                  {normalizedSearch && (
                    <span className={`ml-auto rounded-full px-3 py-1 text-sm font-extrabold ${accent.chip}`}>
                      {columnOrders.length} shown
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  {stage === "staging"
                    ? COURIERS.map((c) => {
                        const group = columnOrders.filter((o) => o.courier === c);
                        return (
                          <div key={c} className="overflow-hidden rounded-2xl border-2 border-stage-staging/40 bg-card/60">
                            <div className={`flex items-center justify-between gap-2 border-b-2 px-3 py-2 ${COURIER_ACCENT[c]}`}>
                              <p className="text-lg font-extrabold">{c}</p>
                              <span className="rounded-lg bg-card/90 px-2 py-1 text-sm font-bold text-foreground">
                                Pickup {PICKUP_TIME}
                              </span>
                            </div>
                            <div className="flex flex-col gap-3 p-2">
                              {group.map((order: Order) => (
                                <OrderCard
                      key={order.id}
                      order={order}
                      columnStage={stage}
                      flashing={flashId === order.id}
                      onAdvance={advanceOrder}
                    />
                              ))}
                              {group.length === 0 && (
                                <p className="py-3 text-center text-sm font-semibold text-muted-foreground">No boxes yet</p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    : columnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      columnStage={stage}
                      flashing={flashId === order.id}
                      onAdvance={advanceOrder}
                    />
                  ))}
                  {columnOrders.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-border p-6 text-center text-base font-semibold text-muted-foreground">
                      {normalizedSearch ? "No matching orders" : "Drop orders here"}
                    </div>
                  )}
                </div>

                {rushCount > 0 && (
                  <p className="mt-3 text-center text-sm font-bold uppercase tracking-wide text-rush">
                    {rushCount} rush {rushCount === 1 ? "order" : "orders"} in this step
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 pb-6 text-sm font-medium text-muted-foreground">
          <p>Drag a card to any column, or press its “Move to” button. Saved automatically on this device.</p>
          <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIssueOpen(true)}
            className="rounded-2xl bg-delayed px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-delayed-foreground shadow-md hover:brightness-105 active:scale-[0.98]"
          >
            ⚠ Issue Log
          </button>
          <button
            onClick={resetDay}
            className="rounded-xl border-2 border-border bg-card px-4 py-2 text-sm font-bold uppercase tracking-wide text-foreground hover:bg-secondary"
          >
            Reset demo day
          </button>
          </div>
        </footer>
      </main>

      <IssueLog open={issueOpen} onClose={() => setIssueOpen(false)} />
      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} onScan={handleScan} />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  alert,
}: {
  label: string;
  value: number;
  tone: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border-2 px-4 py-2 text-center ${
        alert ? "border-rush/50 bg-rush/10" : "border-border bg-background"
      }`}
    >
      <p className={`text-3xl font-extrabold leading-none ${tone}`}>{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
