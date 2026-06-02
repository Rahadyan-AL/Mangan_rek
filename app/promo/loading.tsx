import { TypingLoader } from "@/components/typing-loader";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      {/* Modern, non-blocking typing loader */}
      <TypingLoader text="Memuat promo & voucher..." />

      {/* Skeleton cards to preview grid structure layout */}
      <div className="mt-8 grid w-full gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border/50 bg-card/60"
          >
            <div className="space-y-3 border-b border-border/40 bg-muted/20 p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
