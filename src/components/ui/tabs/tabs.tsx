import {
  component$,
  Slot,
  useContextProvider,
  createContextId,
  useSignal,
  useContext,
  $,
  type QRL,
} from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// --- CONTEXT ---
// Se crea un contexto para compartir el estado del tab activo entre los sub-componentes
// sin necesidad de pasar props a través de múltiples niveles (prop drilling).
interface TabsContext {
  activeTab: Readonly<ReturnType<typeof useSignal<string>>>
  setActiveTab: QRL<(value: string) => void>
}
export const TabsContext = createContextId<TabsContext>('qwik.ui.tabs')

// --- STYLES ---
const tabsListVariants = cva(
  'inline-flex gap-1 h-12 items-center justify-center rounded-xl bg-muted p-2 border border-muted-foreground/20 shadow-sm'
)
const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium border border-muted-foreground/30 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      active: {
        true: 'bg-white text-black border-2 border-gray-300 shadow z-10',
        false: 'bg-muted text-muted-foreground/80 border border-transparent',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)
const tabsContentVariants = cva(
  'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
)

// --- PROPS ---
export interface TabsProps {
  defaultValue: string
  class?: string
}

export interface TabsListProps {
  class?: string
}

export interface TabsTriggerProps extends VariantProps<typeof tabsTriggerVariants> {
  value: string
  class?: string
  disabled?: boolean
}

export interface TabsContentProps {
  value: string
  class?: string
}

// --- COMPONENTS ---

/**
 * Tabs: El componente raíz que gestiona el estado.
 */
export const Tabs = component$<TabsProps>(({ defaultValue, class: className }) => {
  const activeTab = useSignal(defaultValue)
  const setActiveTab = $((value: string) => {
    activeTab.value = value
  })

  const context: TabsContext = {
    activeTab,
    setActiveTab,
  }

  useContextProvider(TabsContext, context)

  return (
    <div class={cn(className)}>
      <Slot />
    </div>
  )
})

/**
 * TabsList: Contenedor para los botones que activan los tabs.
 */
export const TabsList = component$<TabsListProps>(({ class: className }) => {
  return (
    <div role="tablist" class={cn(tabsListVariants(), className)}>
      <Slot />
    </div>
  )
})

/**
 * TabsTrigger: El botón individual que activa un tab.
 */
export const TabsTrigger = component$<TabsTriggerProps>(
  ({ value, class: className, disabled }) => {
    const context = useContext(TabsContext)
    const isActive = context.activeTab.value === value

    const handleKeyDown$ = $((event: KeyboardEvent, element: HTMLButtonElement) => {
      const parent = element.parentElement
      if (!parent) return

      const triggers = Array.from(
        parent.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      )
      const currentIndex = triggers.indexOf(element)

      let nextIndex = -1
      if (event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % triggers.length
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length
      }

      if (nextIndex !== -1) {
        event.preventDefault()
        triggers[nextIndex].focus()
      }
    })

    return (
      <button
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={`tab-content-${value}`}
        id={`tab-trigger-${value}`}
        disabled={disabled}
        class={cn(tabsTriggerVariants({ active: isActive }), className)}
        onClick$={() => context.setActiveTab(value)}
        onKeyDown$={handleKeyDown$}
      >
        <Slot />
      </button>
    )
  }
)

/**
 * TabsContent: El panel que muestra el contenido de un tab activo.
 */
export const TabsContent = component$<TabsContentProps>(({ value, class: className }) => {
  const context = useContext(TabsContext)
  const isActive = context.activeTab.value === value

  return (
    <div
      role="tabpanel"
      aria-labelledby={`tab-trigger-${value}`}
      id={`tab-content-${value}`}
      hidden={!isActive}
      class={cn(tabsContentVariants(), className)}
    >
      <Slot />
    </div>
  )
})
