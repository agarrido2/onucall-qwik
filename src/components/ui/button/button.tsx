import { cn } from '../../../lib/utils'
import { 
  component$, 
  Slot, 
  useStylesScoped$,
  type PropFunction 
} from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md active:scale-95',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-95',
        success:
          'bg-success text-success-foreground shadow hover:bg-success/90 hover:shadow-md active:scale-95',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-95',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:scale-95',
        link: 'text-primary underline-offset-4 hover:underline focus:underline hover:text-primary/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8 text-base',
        xl: 'h-12 rounded-md px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  class?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick$?: PropFunction<() => void>
  children?: any
}

/**
 * Button Component - Super Optimizado
 * 
 * ✅ Siguiendo patrones del Toast (referencia de éxito)
 * ✅ useStylesScoped$ para micro-interacciones
 * ✅ Props filtradas correctamente
 * ✅ Tipos explícitos y seguros
 * ✅ Accesibilidad completa
 */
export const Button = component$<ButtonProps>(
  ({ variant, size, class: className, type = 'button', disabled, onClick$, children }) => {
    
    useStylesScoped$(`
      .button-enhanced {
        position: relative;
        overflow: hidden;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .button-enhanced::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
      }

      .button-enhanced:active::before {
        width: 200%;
        height: 200%;
      }

      .button-enhanced:hover {
        transform: translateY(-1px);
      }

      .button-enhanced:active {
        transform: translateY(0) scale(0.98);
      }

      .button-enhanced:disabled {
        transform: none;
      }

      .button-enhanced:disabled::before {
        display: none;
      }
    `)

    return (
      <button 
        type={type}
        class={cn(buttonVariants({ variant, size }), 'button-enhanced', className)}
        disabled={disabled}
        onClick$={onClick$}
      >
        <Slot>{children}</Slot>
      </button>
    )
  }
)
