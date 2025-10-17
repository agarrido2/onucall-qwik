import {
  component$,
  useStore,
  useStylesScoped$,
  $,
  useTask$,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// --- TYPES ---
export type Toast = {
  id: number
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'warning' | 'success'
}

export type ToastInput = Omit<Toast, 'id'>

// --- EVENT SYSTEM ---
const TOAST_EVENT_NAME = 'show-toast'

// API pública simple para crear toasts - funciones separadas para evitar problemas con Object.assign en QRL
export const toast = $((newToast: ToastInput) => {
  const event = new CustomEvent(TOAST_EVENT_NAME, { detail: newToast })
  document.dispatchEvent(event)
})

// Funciones de conveniencia para diferentes tipos de toast
export const toastSuccess = $((title: string, description?: string) => {
  const event = new CustomEvent(TOAST_EVENT_NAME, { 
    detail: { title, description, variant: 'success' as const } 
  })
  document.dispatchEvent(event)
})

export const toastError = $((title: string, description?: string) => {
  const event = new CustomEvent(TOAST_EVENT_NAME, { 
    detail: { title, description, variant: 'destructive' as const } 
  })
  document.dispatchEvent(event)
})

export const toastWarning = $((title: string, description?: string) => {
  const event = new CustomEvent(TOAST_EVENT_NAME, { 
    detail: { title, description, variant: 'warning' as const } 
  })
  document.dispatchEvent(event)
})

export const toastInfo = $((title: string, description?: string) => {
  const event = new CustomEvent(TOAST_EVENT_NAME, { 
    detail: { title, description, variant: 'default' as const } 
  })
  document.dispatchEvent(event)
})

// --- STYLES ---
const toasterVariants = cva(
  'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]'
)

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'icon-toast toast-info border border-primary bg-[#e6f3ff] text-black shadow-md',
        destructive: 'icon-toast toast-error border border-error bg-[#fee] text-black',
        warning: 'icon-toast toast-warning border border-warning bg-[#fffbeb] text-black',
        success: 'icon-toast toast-success border border-success bg-[#f0fdf4] text-black',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// --- PROPS ---
export interface ToasterProps {
  class?: string
  duration?: number
}

export interface ToastComponentProps extends VariantProps<typeof toastVariants> {
  toast: Toast
  duration: number
  toastStore: { toasts: Toast[] }
}

// --- COMPONENTS ---

/**
 * Componente individual de toast
 */
export const ToastComponent = component$<ToastComponentProps>(
  ({ toast, duration, toastStore, variant }) => {
    const shouldRemove = useSignal(false);

    useStylesScoped$(`
      /* Toast Icons - Base común para todos los iconos */
      .icon-toast:before {
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        background-size: contain;
        background-repeat: no-repeat;
      }

      /* Iconos específicos por tipo de toast */
      .toast-info:before {
        background-image: url("data:image/svg+xml,%3Csvg fill='currentColor' width='16px' height='16px' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212ZM132,80v48a4,4,0,0,1-8,0V80a4,4,0,0,1,8,0Zm-4,80a8,8,0,1,1-8,8A8,8,0,0,1,128,160Z'/%3E%3C/svg%3E");
      }

      .toast-success:before {
        background-image: url("data:image/svg+xml,%3Csvg fill='currentColor' width='16px' height='16px' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z'/%3E%3C/svg%3E");
      }

      .toast-error:before {
        background-image: url("data:image/svg+xml,%3Csvg fill='currentColor' width='16px' height='16px' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z'/%3E%3C/svg%3E");
      }

      .toast-warning:before {
        background-image: url("data:image/svg+xml,%3Csvg fill='currentColor' width='16px' height='16px' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z'/%3E%3C/svg%3E");
      }

      /* Animaciones */
      @keyframes toast-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes toast-slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      .toast-enter {
        animation: toast-slide-in 0.3s ease-out;
      }

      .toast-exit {
        animation: toast-slide-out 0.3s ease-in;
      }
    `)

    // Auto-remove toast after duration usando useTask$ (mejores prácticas de Qwik)
    useTask$(({ cleanup }) => {
      const timer = setTimeout(() => {
        shouldRemove.value = true;
      }, duration);

      cleanup(() => clearTimeout(timer));
    });

    // Reactivo: cuando shouldRemove cambia, eliminar del store
    useTask$(({ track }) => {
      const remove = track(() => shouldRemove.value);
      if (remove) {
        toastStore.toasts = toastStore.toasts.filter(t => t.id !== toast.id);
      }
    });

    return (
      <div
        class={cn(
          toastVariants({ variant: variant || toast.variant }),
          'toast-enter'
        )}
      >
        <div class="grid gap-1">
          <div class="text-sm font-semibold">{toast.title}</div>
          {toast.description && (
            <div class="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
        <button
          class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
          onClick$={() => {
            toastStore.toasts = toastStore.toasts.filter(t => t.id !== toast.id)
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    )
  }
)

/**
 * Toaster: Contenedor principal que maneja todos los toasts
 * Colócalo una vez en tu layout raíz.
 */
export const Toaster = component$<ToasterProps>(
  ({ class: className, duration = 3000 }) => {
    const toastStore = useStore<{ toasts: Toast[] }>({ toasts: [] })
    const listenerAdded = useSignal(false)

    // Usar useVisibleTask$ para operaciones que requieren DOM (solo cliente)
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      // Solo agregar listener una vez
      if (listenerAdded.value) return

      const handleShowToast = (event: Event) => {
        const customEvent = event as CustomEvent<ToastInput>
        const newToast = { ...customEvent.detail, id: Date.now() }
        toastStore.toasts = [...toastStore.toasts, newToast]
      }

      document.addEventListener(TOAST_EVENT_NAME, handleShowToast)
      listenerAdded.value = true

      cleanup(() => {
        document.removeEventListener(TOAST_EVENT_NAME, handleShowToast)
        listenerAdded.value = false
      })
    })

    return (
      <div
        aria-live="polite"
        role="region"
        class={cn(toasterVariants(), className)}
      >
        {toastStore.toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            duration={duration}
            toastStore={toastStore}
          />
        ))}
      </div>
    )
  }
)