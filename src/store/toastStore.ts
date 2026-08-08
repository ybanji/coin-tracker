import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
}

const DEFAULT_DURATION_MS = 4000;

/**
 * Minimal, dependency-free toast store. Feature code calls `toast.success(...)`
 * / `toast.error(...)` (see the `toast` helper below) instead of touching
 * this store directly, keeping call sites terse.
 */
export const useToastStore = create<ToastState>((_set) => ({
  toasts: [],
  show: (toast) => {
    const id = crypto.randomUUID();
    _set((_state) => ({ toasts: [..._state.toasts, { ...toast, id }] }));
    return id;
  },
  dismiss: (id) => _set((_state) => ({ toasts: _state.toasts.filter((t) => t.id !== id) })),
}));

function push(variant: ToastVariant, title: string, description?: string) {
  const id = useToastStore.getState().show({ title, description, variant });
  window.setTimeout(() => useToastStore.getState().dismiss(id), DEFAULT_DURATION_MS);
  return id;
}

/** Imperative toast API — usable from event handlers, stores, or anywhere outside render. */
export const toast = {
  success: (title: string, description?: string) => push("success", title, description),
  error: (title: string, description?: string) => push("error", title, description),
  info: (title: string, description?: string) => push("info", title, description),
};
