import { useEffect, useRef, useState } from "react";
import { Camera, ScanLine, X } from "lucide-react";
import { PRODUCT_PHOTOS, STAGE_LABELS, type Order } from "@/data/orders";
import { Button } from "@/components/ui/button";

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
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            className="h-11 w-11 rounded-xl"
            aria-label="Close scanner"
          >
            <X className="size-6" />
          </Button>
        </div>

        <div className="relative mt-4 aspect-[16/7] overflow-hidden rounded-2xl border-2 border-foreground/20 bg-foreground" aria-hidden>
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,var(--color-card)_0_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute inset-5 rounded-xl border-2 border-primary-foreground/70">
            <span className="absolute left-0 top-0 h-7 w-7 border-l-4 border-t-4 border-success" />
            <span className="absolute right-0 top-0 h-7 w-7 border-r-4 border-t-4 border-success" />
            <span className="absolute bottom-0 left-0 h-7 w-7 border-b-4 border-l-4 border-success" />
            <span className="absolute bottom-0 right-0 h-7 w-7 border-b-4 border-r-4 border-success" />
            <span className="camera-scan-line absolute left-4 right-4 h-0.5 bg-rush shadow-[0_0_10px_var(--color-rush)]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
            <Camera className="size-12 opacity-80" strokeWidth={1.5} />
          </div>
          <p className="absolute bottom-3 left-0 right-0 text-center text-sm font-bold uppercase text-primary-foreground">Point camera at barcode</p>
        </div>

        <p className="mt-3 text-center text-base text-muted-foreground">Camera preview · or enter a code below</p>

        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="e.g. ORD-10042 or 77001151"
          className="mt-4 w-full rounded-2xl border-2 border-input bg-background px-5 py-5 text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          autoComplete="off"
        />

        <Button
          onClick={handleScan}
          className="mt-3 h-auto w-full rounded-2xl py-5 text-xl font-extrabold uppercase tracking-wide active:scale-[0.99]"
        >
          <ScanLine className="size-6" />
          Scan &amp; Move Next Step
        </Button>

        {result && (
          <div
            className={`mt-4 flex items-center gap-3 rounded-2xl p-4 ${
              result.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
            }`}
            role="status"
          >
            {result.ok && result.photo !== undefined && (
              <img
                src={PRODUCT_PHOTOS[result.photo]!.src}
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
