export type ToastKind = 'success' | 'error' | 'notification';

export function showToast(kind: ToastKind, title: string, message?: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('klarity_toast', {
    detail: { id: `${Date.now()}-${Math.random()}`, kind, title, message },
  }));
}
