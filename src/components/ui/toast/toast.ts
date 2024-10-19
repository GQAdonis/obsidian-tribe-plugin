import { toast as sonnerToast } from 'svelte-sonner';

type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
};

export function toast({ title, description, duration = 3000, variant = 'default' }: ToastProps) {
  const message = title 
    ? (description ? `${title}\n${description}` : title) 
    : (description || 'Notification');
  
  if (variant === 'destructive') {
    sonnerToast.error(message, { duration });
  } else {
    sonnerToast(message, { duration });
  }
}
