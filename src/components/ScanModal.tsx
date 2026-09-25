import { useEffect, useRef, useState } from "react";
import { PRODUCT_PHOTOS, STAGE_LABELS, type Order } from "@/data/orders";

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (code: string) => Order | undefined;
}

export default function ScanModal({ open, onClose, onScan }: Props) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string; photo?: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCode("");
      setResult(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const handleScan = () => {
    if (!code.trim()) return;
    const order = onScan(code);
    if (order) {
      setResult({
        ok: true,
        text: `${order.id} → ${STAGE_LABELS[order.stage]}`,
        photo: order.photo,
      });
    } else {
      setResult({ ok: false, text: `No order found for "${code.trim()}"` });
    }
    setCode("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Scan barcode"
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="stage-headline text-2xl text-foreground">Scan Barcode</h2>
          <button
            onClick={onClose}
            className="rounded-xl bg-secondary px-4 py-2 text-lg font-bold text-secondary-foreground hover:bg-accent"
            aria-label="Close scanner"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-lg text-muted-foreground">
          Scan with the gun or type the code, then press Enter.
        </p>

        <div className="barcode-stripes mt-4 h-3 rounded-full opacity-60" aria-hidden />

        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="e.g. ORD-10042 or 77001151"
          className="mt-4 w-full rounded-2xl border-2 border-input bg-background px-5 py-5 text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          autoComplete="off"
        />

        <button
          onClick={handleScan}
          className="mt-3 w-full rounded-2xl bg-primary py-5 text-2xl font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.99]"
        >
          Find &amp; Move Next Step
        </button>

        {result && (
          <div
            className={`mt-4 flex items-center gap-3 rounded-2xl p-4 ${
              result.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
            }`}
            role="status"
          >
            {result.ok && result.photo !== undefined && (
              <img
                src={PRODUCT_PHOTOS[result.photo].src}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-xl border border-border object-cover"
              />
            )}
            <p className="text-xl font-extrabold">
              {result.ok ? "✓ " : "✕ "}
              {result.text}
            </p>
          </div>
        )}

        <p className="mt-4 text-center text-base text-muted-foreground">
          Tip: scan an order twice to move it two steps ahead.
        </p>
      </div>
    </div>
  );
}
