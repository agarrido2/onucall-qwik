import { cn } from '../../../lib/utils';
import {
  component$,
  Slot,
  useContextProvider,
  createContextId,
  useStore,
  useContext,
  $,
  type QRL,
  useStylesScoped$,
} from '@builder.io/qwik'
import { cva } from 'class-variance-authority';

interface AccordionContext {
  openValues: string[]
  toggleValue: QRL<(value: string) => void>
  collapsible: boolean
  type: 'single' | 'multiple'
}
export const AccordionContext = createContextId<AccordionContext>('qwik.ui.accordion')

interface AccordionItemContext {
  value: string
}
export const AccordionItemContext = createContextId<AccordionItemContext>('qwik.ui.accordion-item')

// --- STYLES ---
const accordionItemVariants = cva('border-b')
const accordionTriggerVariants = cva(
  'flex w-full flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180'
)
const accordionContentVariants = cva(
  'overflow-hidden text-sm transition-all data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]'
)

// --- PROPS ---
export interface AccordionProps {
  class?: string
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
}
export interface AccordionItemProps {
  class?: string
  value: string
}
export interface AccordionTriggerProps {
  class?: string
}
export interface AccordionContentProps {
  class?: string
}

// --- COMPONENTS ---

export const Accordion = component$<AccordionProps>(
  ({ type = 'single', collapsible = false, defaultValue, class: className }) => {
    const state = useStore({
      openValues: Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
        ? [defaultValue]
        : [],
    })

    const toggleValue = $((value: string) => {
      if (type === 'single') {
        if (state.openValues[0] === value && collapsible) {
          state.openValues.length = 0; // cerrar si es el mismo y colapsable
        } else {
          state.openValues.length = 0;
          state.openValues.push(value); // abrir el nuevo
        }
      } else {
        const index = state.openValues.indexOf(value);
        if (index > -1) {
          state.openValues.splice(index, 1);
        } else {
          state.openValues.push(value);
        }
      }
    })

    const context: AccordionContext = {
      openValues: state.openValues,
      toggleValue,
      collapsible,
      type,
    }

    useContextProvider(AccordionContext, context)

    useStylesScoped$(`
      .grid-rows-\\[0fr\\] { grid-template-rows: 0fr; }
      .grid-rows-\\[1fr\\] { grid-template-rows: 1fr; }
    `)

    return (
      <div class={cn('w-full', className)}>
        <Slot />
      </div>
    )
  }
)

export const AccordionItem = component$<AccordionItemProps>(({ value, class: className }) => {
  const itemContext: AccordionItemContext = { value }
  useContextProvider(AccordionItemContext, itemContext)

  const rootContext = useContext(AccordionContext)
  const isExpanded = rootContext.openValues.includes(value)

  return (
    <div
      data-state={isExpanded ? 'open' : 'closed'}
      class={cn(accordionItemVariants(), className)}
    >
      <Slot />
    </div>
  )
})

export const AccordionTrigger = component$<AccordionTriggerProps>(({ class: className }) => {
  const rootContext = useContext(AccordionContext)
  const itemContext = useContext(AccordionItemContext)
  const isExpanded = rootContext.openValues.includes(itemContext.value)

  return (
    <h3>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${itemContext.value}`}
        data-state={isExpanded ? 'open' : 'closed'}
        class={cn(accordionTriggerVariants(), className)}
        onClick$={() => rootContext.toggleValue(itemContext.value)}
      >
        <Slot />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 shrink-0 transition-transform duration-200 pointer-events-none"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </h3>
  )
})

export const AccordionContent = component$<AccordionContentProps>(({ class: className }) => {
  const rootContext = useContext(AccordionContext)
  const itemContext = useContext(AccordionItemContext)
  const isExpanded = rootContext.openValues.includes(itemContext.value)

  return (
    <div
      id={`accordion-content-${itemContext.value}`}
      data-state={isExpanded ? 'open' : 'closed'}
      class={cn(
        'grid transition-all duration-300 ease-in-out',
        isExpanded
          ? 'grid-rows-[1fr] opacity-100 scale-100 shadow-lg'
          : 'grid-rows-[0fr] opacity-0 scale-95 shadow-none',
        accordionContentVariants(),
        className
      )}
      aria-hidden={!isExpanded}
    >
      <div class="overflow-hidden">
        <div class="pb-4 pt-0">
          <Slot />
        </div>
      </div>
    </div>
  )
})
