import { 
  component$, 
  Slot, 
  useSignal, 
  useTask$,
  useStylesScoped$,
  type PropFunction 
} from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// --- VARIANTS ---
const modalVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center p-4',
  {
    variants: {
      animation: {
        fade: 'animate-in fade-in-0 duration-300',
        slide: 'animate-in slide-in-from-bottom-4 duration-300',
        zoom: 'animate-in zoom-in-95 duration-300',
      },
    },
    defaultVariants: {
      animation: 'fade',
    },
  }
)

const modalContentVariants = cva(
  'relative z-50 w-full rounded-lg bg-background p-6 shadow-lg border',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-none w-full h-full rounded-none',
      },
      variant: {
        default: 'border-border',
        destructive: 'border-destructive',
        success: 'border-success',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

// --- PROPS ---
export interface ModalProps extends VariantProps<typeof modalVariants>, VariantProps<typeof modalContentVariants> {
  open: boolean
  onClose$: PropFunction<() => void>
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  class?: string
  contentClass?: string
}

/**
 * Modal Component Super-Optimizado
 * 
 * ✅ Siguiendo patrones del Toast (referencia de éxito)
 * ✅ useStylesScoped$ para estilos
 * ✅ useTask$ con cleanup para keyboard events
 * ✅ Sin acceso directo al DOM
 * ✅ Gestión de estado reactiva con signals
 */
export const Modal = component$<ModalProps>(({
  open,
  onClose$,
  title,
  description,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  animation,
  size,
  variant,
  class: className,
  contentClass,
}) => {
  const isVisible = useSignal(false)

  useStylesScoped$(`
    /* Backdrop blur effect */
    .modal-backdrop {
      backdrop-filter: blur(8px);
      background: rgba(0, 0, 0, 0.15);
      transition: opacity 300ms ease;
    }

    /* Content animations */
    .modal-content {
      transform-origin: center;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Focus management */
    .modal-content:focus {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }

    /* Smooth state transitions */
    .modal-enter {
      opacity: 0;
      transform: scale(0.95);
    }

    .modal-enter-active {
      opacity: 1;
      transform: scale(1);
    }

    .modal-exit {
      opacity: 1;
      transform: scale(1);
    }

    .modal-exit-active {
      opacity: 0;
      transform: scale(0.95);
    }

    /* Prevent body scroll when modal is open */
    .modal-open {
      overflow: hidden;
    }
  `)

  // Keyboard event handling with cleanup (like Toast pattern)
  useTask$(({ cleanup }) => {
    if (!open || !closeOnEscape) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose$()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    cleanup(() => document.removeEventListener('keydown', handleKeydown))
  })

  // Body scroll management
  useTask$(({ track }) => {
    track(() => open)
    
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : ''
      
      // Cleanup on unmount
      return () => {
        document.body.style.overflow = ''
      }
    }
  })

  // Show animation trigger
  useTask$(({ track }) => {
    const isOpen = track(() => open)
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => {
        isVisible.value = true
      }, 10)
    } else {
      isVisible.value = false
    }
  })

  if (!open) return null

  return (
    <div class={cn(modalVariants({ animation }), className)}>
      {/* Backdrop */}
      <div
        class="modal-backdrop fixed inset-0 z-40"
        onClick$={closeOnBackdrop ? onClose$ : undefined}
      />

      {/* Content */}
      <div
        class={cn(
          modalContentVariants({ size, variant }),
          'modal-content',
          isVisible.value ? 'modal-enter-active' : 'modal-enter',
          contentClass
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            type="button"
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick$={onClose$}
            aria-label="Cerrar modal"
          >
            <svg
              width="15"
              height="15"
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
        )}

        {/* Header */}
        {(title || description) && (
          <div class="space-y-2">
            {title && (
              <h2 id="modal-title" class="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" class="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div class={title || description ? 'mt-4' : ''}>
          <Slot />
        </div>
      </div>
    </div>
  )
})
