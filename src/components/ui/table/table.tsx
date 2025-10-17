import { component$, Slot, type PropFunction } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// =============================================================================
// CVA VARIANTS - Sistema de variantes tipadas para máxima flexibilidad
// =============================================================================

const tableVariants = cva(
  'w-full caption-bottom text-sm border-collapse',
  {
    variants: {
      variant: {
        default: 'border-separate border-spacing-0',
        bordered: 'border border-border rounded-lg overflow-hidden',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/30',
        minimal: 'border-0'
      },
      size: {
        sm: 'text-xs [&_th]:py-2 [&_th]:px-3 [&_td]:py-2 [&_td]:px-3',
        default: 'text-sm [&_th]:py-3 [&_th]:px-4 [&_td]:py-3 [&_td]:px-4',
        lg: 'text-base [&_th]:py-4 [&_th]:px-6 [&_td]:py-4 [&_td]:px-6'
      },
      density: {
        compact: '[&_th]:py-1 [&_th]:px-2 [&_td]:py-1 [&_td]:px-2',
        default: '',
        comfortable: '[&_th]:py-4 [&_th]:px-6 [&_td]:py-4 [&_td]:px-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      density: 'default'
    }
  }
)

const tableHeaderVariants = cva(
  'border-b bg-muted/50',
  {
    variants: {
      variant: {
        default: 'border-border',
        minimal: 'border-transparent bg-transparent',
        elevated: 'border-border shadow-sm bg-background'
      },
      sticky: {
        true: 'sticky top-0 z-10',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      sticky: false
    }
  }
)

const tableRowVariants = cva(
  'border-b transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-border hover:bg-muted/30',
        minimal: 'border-transparent hover:bg-muted/20',
        interactive: 'border-border hover:bg-muted/50 cursor-pointer hover:shadow-sm',
        selected: 'border-border bg-primary/10 hover:bg-primary/15'
      },
      state: {
        default: '',
        hover: 'bg-muted/30',
        selected: 'bg-primary/10',
        disabled: 'opacity-50 cursor-not-allowed'
      }
    },
    defaultVariants: {
      variant: 'default',
      state: 'default'
    }
  }
)

const tableCellVariants = cva(
  'align-middle text-left',
  {
    variants: {
      variant: {
        default: '',
        head: 'font-semibold text-muted-foreground text-xs uppercase tracking-wider',
        numeric: 'text-right font-mono tabular-nums',
        center: 'text-center',
        action: 'text-center w-[80px]'
      },
      truncate: {
        true: 'truncate max-w-[200px]',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      truncate: false
    }
  }
)

// =============================================================================
// TYPESCRIPT INTERFACES - Tipado estricto para máxima seguridad
// =============================================================================

export interface TableProps extends VariantProps<typeof tableVariants> {
  class?: string
  'data-testid'?: string
}

export interface TableHeaderProps extends VariantProps<typeof tableHeaderVariants> {
  class?: string
  'data-testid'?: string
}

export interface TableBodyProps {
  class?: string
  'data-testid'?: string
}

export interface TableRowProps extends VariantProps<typeof tableRowVariants> {
  class?: string
  'data-testid'?: string
  'data-selected'?: boolean
  onClick$?: PropFunction<() => void>
}

export interface TableCellProps extends VariantProps<typeof tableCellVariants> {
  class?: string
  'data-testid'?: string
  as?: 'td' | 'th'
  colspan?: number
}

export interface TableHeadProps extends VariantProps<typeof tableCellVariants> {
  class?: string
  'data-testid'?: string
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
  onClick$?: PropFunction<() => void>
}

// =============================================================================
// COMPONENTS - Compound Components con máxima composabilidad
// =============================================================================

export const Table = component$<TableProps>(({ 
  variant, 
  size, 
  density, 
  class: className, 
  ...props 
}) => {
  return (
    <div class="relative w-full overflow-auto rounded-lg border border-border">
      <table
        class={cn(tableVariants({ variant, size, density }), className)}
        role="table"
        {...props}
      >
        <Slot />
      </table>
    </div>
  )
})

export const TableHeader = component$<TableHeaderProps>(({ 
  variant, 
  sticky, 
  class: className, 
  ...props 
}) => {
  return (
    <thead 
      class={cn(tableHeaderVariants({ variant, sticky }), className)} 
      role="rowgroup"
      {...props}
    >
      <Slot />
    </thead>
  )
})

export const TableBody = component$<TableBodyProps>(({ 
  class: className, 
  ...props 
}) => {
  return (
    <tbody 
      class={cn('[&_tr:last-child]:border-0', className)} 
      role="rowgroup"
      {...props}
    >
      <Slot />
    </tbody>
  )
})

export const TableRow = component$<TableRowProps>(({ 
  variant, 
  state, 
  class: className,
  onClick$,
  ...props 
}) => {
  return (
    <tr 
      class={cn(tableRowVariants({ variant, state }), className)} 
      role="row"
      onClick$={onClick$}
      {...props}
    >
      <Slot />
    </tr>
  )
})

export const TableHead = component$<TableHeadProps>(({ 
  variant = 'head', 
  truncate, 
  class: className, 
  sortable = false,
  sorted = false,
  onClick$,
  ...props 
}) => {
  return (
    <th 
      class={cn(
        tableCellVariants({ variant, truncate }),
        sortable && 'cursor-pointer select-none hover:bg-muted/70 active:bg-muted',
        sorted && 'font-bold bg-background', // Agregar font-semibold cuando está ordenado
        className
      )} 
      role="columnheader"
      aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none'}
      tabIndex={sortable ? 0 : undefined}
      onClick$={onClick$}
      {...props}
    >
      <div class={cn(
        'flex items-center gap-2',
        variant === 'numeric' && 'justify-end',
        variant === 'center' && 'justify-center'
      )}>
        <Slot />
        {sortable && sorted && (
          <span class={cn(
            'text-sm transition-colors select-none',
            'text-foreground'
          )}>
            {sorted === 'asc' ? '△' : '▽'}
          </span>
        )}
      </div>
    </th>
  )
})

export const TableCell = component$<TableCellProps>(({ 
  variant, 
  truncate, 
  class: className, 
  as = 'td',
  colspan,
  ...props 
}) => {
  const Component = as
  
  return (
    <Component 
      class={cn(tableCellVariants({ variant, truncate }), className)} 
      role={as === 'th' ? 'columnheader' : 'cell'}
      colSpan={colspan}
      {...props}
    >
      <Slot />
    </Component>
  )
})
