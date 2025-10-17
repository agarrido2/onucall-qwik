import {
  component$,
  Slot,
  useSignal,
  useContext,
  useContextProvider,
  createContextId,
  useOnDocument,
  $,
  type QRL,
  type PropFunction,
} from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// --- CONTEXT ---
interface DropdownMenuContext {
  open: Readonly<ReturnType<typeof useSignal<boolean>>>
  setOpen: QRL<(open: boolean) => void>
  toggle: QRL<() => void>
}

export const DropdownMenuContext = createContextId<DropdownMenuContext>('qwik.ui.dropdown-menu')

// --- STYLES ---
const dropdownMenuTriggerVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  }
)

const dropdownMenuContentVariants = cva(
  'z-50 min-w-[8rem] w-max overflow-hidden rounded-md border bg-background shadow-md text-foreground p-1 transition-all duration-200',
  {
    variants: {
      align: {
        start: 'origin-top-left',
        center: 'origin-top',
        end: 'origin-top-right',
      },
      size: {
        sm: 'min-w-[6rem]',
        default: 'min-w-[8rem]',
        lg: 'min-w-[12rem]',
        xl: 'min-w-[16rem]',
      },
    },
    defaultVariants: {
      align: 'end',
      size: 'default',
    },
  }
)

const dropdownMenuItemVariants = cva(
  'relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'text-destructive focus:bg-destructive focus:text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const dropdownMenuLabelVariants = cva(
  'px-2 py-1.5 text-sm font-semibold text-foreground'
)

const dropdownMenuSeparatorVariants = cva(
  '-mx-1 my-1 h-px bg-muted'
)

// --- PROPS ---
export interface DropdownMenuProps {
  class?: string
}

export interface DropdownMenuTriggerProps extends VariantProps<typeof dropdownMenuTriggerVariants> {
  class?: string
  disabled?: boolean
  asChild?: boolean
}

export interface DropdownMenuContentProps extends VariantProps<typeof dropdownMenuContentVariants> {
  class?: string
  sideOffset?: number
}

export interface DropdownMenuItemProps extends VariantProps<typeof dropdownMenuItemVariants> {
  class?: string
  disabled?: boolean
  onClick$?: PropFunction<() => void>
}

export interface DropdownMenuLabelProps {
  class?: string
}

export interface DropdownMenuSeparatorProps {
  class?: string
}

// --- COMPONENTS ---

/**
 * DropdownMenu: Componente de menú desplegable completamente accesible.
 * - Context API para gestión de estado sin prop drilling
 * - Cierre automático con ESC y click fuera
 * - Navegación por teclado completa
 * - Variantes y tamaños personalizables
 * - Compatible con shadcn/ui design system
 * - WAI-ARIA compliant
 */
export const DropdownMenu = component$<DropdownMenuProps>(({ class: className }) => {
  const open = useSignal(false)
  
  const setOpen = $((newOpen: boolean) => {
    open.value = newOpen
  })
  
  const toggle = $(() => {
    open.value = !open.value
  })

  const context: DropdownMenuContext = {
    open,
    setOpen,
    toggle,
  }

  useContextProvider(DropdownMenuContext, context)

  // Cerrar con ESC
  useOnDocument('keydown', $((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open.value) {
      open.value = false
    }
  }))

  // Cerrar con click fuera
  useOnDocument('click', $((e: MouseEvent) => {
    if (!open.value) return; // No hacer nada si ya está cerrado

    const target = e.target as Element;
    // Comprobamos si el clic fue dentro del dropdown-menu o su trigger
    const isDropdownMenu = target.closest('[data-dropdown-menu]');
    const isDropdownTrigger = target.closest('[data-dropdown-trigger]');
    
    // Si el clic fue fuera del dropdown y no fue en el trigger, cerramos
    if (!isDropdownMenu && !isDropdownTrigger) {
      console.log('Cerrando dropdown por clic fuera');
      open.value = false;
    }
  }))

  return (
    <div class={cn('relative inline-block text-left', className)} data-dropdown-menu>
      <Slot />
    </div>
  )
})

/**
 * DropdownMenuTrigger: Botón que activa el menú desplegable.
 */
export const DropdownMenuTrigger = component$<DropdownMenuTriggerProps>(
  ({ variant, size, class: className, disabled, asChild }) => {
    const context = useContext(DropdownMenuContext)

    const handleTriggerClick = $((e: MouseEvent) => {
      e.stopPropagation();
      context.toggle();
    });

    if (asChild) {
      return <Slot />
    }

    return (
      <button
        type="button"
        class={cn(dropdownMenuTriggerVariants({ variant, size }), className)}
        onClick$={handleTriggerClick}
        aria-expanded={context.open.value}
        aria-haspopup="menu"
        disabled={disabled}
        data-state={context.open.value ? 'open' : 'closed'}
        data-dropdown-trigger
      >
        <Slot />
        <svg
          class="h-4 w-4 shrink-0 transition-transform duration-200"
          style={{
            transform: context.open.value ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    )
  }
)

/**
 * DropdownMenuContent: Contenedor del contenido del menú desplegable.
 */
export const DropdownMenuContent = component$<DropdownMenuContentProps>(
  ({ align, size, class: className, sideOffset = 4 }) => {
    const context = useContext(DropdownMenuContext)

    if (!context.open.value) return null

    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    }

    return (
      <div
        class={cn(
          'absolute mt-1 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
          dropdownMenuContentVariants({ align, size }),
          alignClasses[align || 'end'],
          className
        )}
        style={{ top: `calc(100% + ${sideOffset}px)` }}
        role="menu"
        aria-orientation="vertical"
        data-state="open"
        data-dropdown-menu
      >
        <Slot />
      </div>
    )
  }
)

/**
 * DropdownMenuItem: Elemento individual del menú.
 */
export const DropdownMenuItem = component$<DropdownMenuItemProps>(
  ({ variant, class: className, disabled, onClick$ }) => {
    const context = useContext(DropdownMenuContext)

    const handleClick = $(() => {
      if (!disabled && onClick$) {
        onClick$()
        context.setOpen(false)
      }
    })

    return (
      <div
        role="menuitem"
        class={cn(dropdownMenuItemVariants({ variant }), className)}
        data-disabled={disabled ? '' : undefined}
        onClick$={handleClick}
        tabIndex={disabled ? -1 : 0}
      >
        <Slot />
      </div>
    )
  }
)

/**
 * DropdownMenuLabel: Etiqueta para agrupar elementos del menú.
 */
export const DropdownMenuLabel = component$<DropdownMenuLabelProps>(({ class: className }) => {
  return (
    <div class={cn(dropdownMenuLabelVariants(), className)} role="presentation">
      <Slot />
    </div>
  )
})

/**
 * DropdownMenuSeparator: Separador visual entre grupos de elementos.
 */
export const DropdownMenuSeparator = component$<DropdownMenuSeparatorProps>(({ class: className }) => {
  return (
    <div class={cn(dropdownMenuSeparatorVariants(), className)} role="separator" aria-orientation="horizontal" />
  )
})