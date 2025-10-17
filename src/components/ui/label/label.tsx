import { component$, Slot } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

export interface LabelProps extends VariantProps<typeof labelVariants> {
  class?: string
  for?: string
  required?: boolean
}

export const Label = component$<LabelProps>(({ class: className, required, ...props }) => {
  return (
    <label
      class={cn(labelVariants(), className)}
      {...props}
    >
      <Slot />
      {required && <span class="text-error ml-1">*</span>}
    </label>
  )
})