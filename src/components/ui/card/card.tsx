import { component$, Slot } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// --- STYLES ---
const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-border bg-card',
        elevated: 'border-border bg-card shadow-md hover:shadow-lg',
        outline: 'border-2 border-border bg-transparent',
        ghost: 'border-transparent bg-transparent shadow-none hover:bg-accent/50',
      },
      padding: {
        none: '',
        default: '',
        compact: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
)

const cardHeaderVariants = cva(
  'flex flex-col space-y-1.5',
  {
    variants: {
      padding: {
        none: '',
        default: 'p-6',
        compact: 'p-4',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      padding: 'default',
    },
  }
)

const cardTitleVariants = cva(
  'font-semibold leading-none tracking-tight text-card-foreground',
  {
    variants: {
      size: {
        sm: 'text-lg',
        default: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const cardDescriptionVariants = cva(
  'text-sm text-muted-foreground leading-relaxed'
)

const cardContentVariants = cva(
  '',
  {
    variants: {
      padding: {
        none: '',
        default: 'p-6 pt-0',
        compact: 'p-4 pt-0',
        lg: 'p-8 pt-0',
      },
    },
    defaultVariants: {
      padding: 'default',
    },
  }
)

const cardFooterVariants = cva(
  'flex items-center',
  {
    variants: {
      padding: {
        none: '',
        default: 'p-6 pt-0',
        compact: 'p-4 pt-0',
        lg: 'p-8 pt-0',
      },
    },
    defaultVariants: {
      padding: 'default',
    },
  }
)

// --- PROPS ---
export interface CardProps extends VariantProps<typeof cardVariants> {
  class?: string
}

export interface CardHeaderProps extends VariantProps<typeof cardHeaderVariants> {
  class?: string
}

export interface CardTitleProps extends VariantProps<typeof cardTitleVariants> {
  class?: string
}

export interface CardDescriptionProps {
  class?: string
}

export interface CardContentProps extends VariantProps<typeof cardContentVariants> {
  class?: string
}

export interface CardFooterProps extends VariantProps<typeof cardFooterVariants> {
  class?: string
}

// --- COMPONENTS ---

/**
 * Card: Contenedor flexible y composable para agrupar contenido relacionado.
 * - Sin gestión de imágenes (usa Slot para máxima flexibilidad)
 * - Variantes: default, elevated, outline, ghost
 * - Sistema de padding consistente: none, default, compact, lg
 * - Totalmente accesible y compatible con shadcn/ui
 * - Arquitectura: Card + CardHeader + CardTitle + CardDescription + CardContent + CardFooter
 */
export const Card = component$<CardProps>(({ variant, class: className }) => {
  return (
    <div class={cn(cardVariants({ variant }), className)}>
      <Slot />
    </div>
  )
})

/**
 * CardHeader: Contenedor para título, descripción y metadatos del card.
 */
export const CardHeader = component$<CardHeaderProps>(({ padding, class: className }) => {
  return (
    <div class={cn(cardHeaderVariants({ padding }), className)}>
      <Slot />
    </div>
  )
})

/**
 * CardTitle: Título principal del card con variantes de tamaño.
 */
export const CardTitle = component$<CardTitleProps>(({ size, class: className }) => {
  return (
    <h3 class={cn(cardTitleVariants({ size }), className)}>
      <Slot />
    </h3>
  )
})

/**
 * CardDescription: Texto descriptivo secundario.
 */
export const CardDescription = component$<CardDescriptionProps>(({ class: className }) => {
  return (
    <p class={cn(cardDescriptionVariants(), className)}>
      <Slot />
    </p>
  )
})

/**
 * CardContent: Área principal de contenido del card.
 */
export const CardContent = component$<CardContentProps>(({ padding, class: className }) => {
  return (
    <div class={cn(cardContentVariants({ padding }), className)}>
      <Slot />
    </div>
  )
})

/**
 * CardFooter: Pie del card para acciones, botones o metadatos adicionales.
 */
export const CardFooter = component$<CardFooterProps>(({ padding, class: className }) => {
  return (
    <div class={cn(cardFooterVariants({ padding }), className)}>
      <Slot />
    </div>
  )
})
