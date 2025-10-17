import { component$, Slot } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// --- STYLES ---
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-105 active:scale-95',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md focus:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground shadow hover:bg-secondary/80 hover:shadow-md focus:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 hover:shadow-md focus:bg-destructive/90',
        success:
          'border-transparent bg-success text-success-foreground shadow hover:bg-success/90 hover:shadow-md focus:bg-success/90',
        warning:
          'border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/90 hover:shadow-md focus:bg-warning/90',
        info:
          'border-transparent bg-info text-info-foreground shadow hover:bg-info/90 hover:shadow-md focus:bg-info/90',
        outline:
          'border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md focus:bg-accent focus:text-accent-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-md',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// --- PROPS ---
export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  class?: string
}

// --- COMPONENT ---
/**
 * Badge: Componente de etiqueta o insignia para mostrar estado, categoría o información adicional.
 * - Variantes semánticas: default, secondary, destructive, success, warning, info, outline
 * - Tamaños escalables: sm, default, lg, xl
 * - Micro-interacciones: hover scale + shadow, active scale
 * - Totalmente accesible con focus-visible y ring
 * - Compatible con shadcn/ui design system
 */
export const Badge = component$<BadgeProps>(({ variant, size, class: className }) => {
  return (
    <div class={cn(badgeVariants({ variant, size }), className)}>
      <Slot />
    </div>
  )
})
