import { component$, Slot } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-error/50 text-error dark:border-error [&>svg]:text-error',
        success:
          'border-success/50 text-success dark:border-success [&>svg]:text-success',
        warning:
          'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
        info:
          'border-info/50 text-info dark:border-info [&>svg]:text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps extends VariantProps<typeof alertVariants> {
  class?: string
}

export const Alert = component$<AlertProps>(({ variant, class: className }) => {
  return (
    <div
      role="alert"
      class={cn(alertVariants({ variant }), className)}
    >
      <Slot />
    </div>
  )
})

export const AlertTitle = component$<{ class?: string }>(({ class: className }) => {
  return (
    <h5 class={cn("mb-1 font-medium leading-none tracking-tight", className)}>
      <Slot />
    </h5>
  )
})

export const AlertDescription = component$<{ class?: string }>(({ class: className }) => {
  return (
    <div class={cn("text-sm [&_p]:leading-relaxed", className)}>
      <Slot />
    </div>
  )
})