import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import type { Toast, ToastVariant } from "@/store/toastStore";
import { cn } from "@/lib/utils";

const iconFor: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colorFor: Record<ToastVariant, string> = {
  success: "text-success",
  error: "text-error",
  info: "text-primary",
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const Icon = iconFor[toast.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 32, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="status"
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border-subtle bg-bg-elevated p-4 shadow-popover"
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", colorFor[toast.variant])} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-caption font-medium text-text-primary">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-caption text-text-muted">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-text-muted transition-colors duration-200 hover:text-text-primary"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

/** Mounted once at the app root. Renders as a fixed stack, bottom-right on desktop, full-width on mobile. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:right-4"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
