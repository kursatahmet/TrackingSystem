export type ToastVariant = 'success' | 'danger' | 'info';

export interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}
