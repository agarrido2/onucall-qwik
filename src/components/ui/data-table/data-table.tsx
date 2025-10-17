import { 
  component$, 
  useStore, 
  useSignal, 
  $, 
  type PropFunction
} from '@builder.io/qwik'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../table'
import { Button } from '../button'
import { Input } from '../input'
import { Badge } from '../badge'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

// =============================================================================
// UTILITIES - Compatible with Qwik serialization
// =============================================================================
// =============================================================================
// CVA VARIANTS - Sistema de variantes tipadas
// =============================================================================

const dataTableVariants = cva(
  'relative space-y-4',
  {
    variants: {
      variant: {
        default: '',
        bordered: '[&_table]:border [&_table]:border-border',
        striped: '[&_table]:table-striped',
        minimal: 'space-y-2'
      },
      density: {
        compact: 'space-y-2 [&_table]:text-xs',
        default: 'space-y-4',
        comfortable: '[&_th]:h-12 [&_th]:px-4 [&_td]:p-4'
      },
      loading: {
        true: 'pointer-events-none opacity-60',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      density: 'default',
      loading: false
    }
  }
)

// =============================================================================
// TYPESCRIPT INTERFACES - Qwik-compatible
// =============================================================================

export interface DataTableColumn {
  id: string
  header: string
  accessorKey?: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  hideOnMobile?: boolean
  cellType?: 'text' | 'number' | 'boolean' | 'date' | 'badge' | 'custom'
  meta?: Record<string, any>
}

export interface DataTableState {
  searchTerm: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  currentPage: number
  pageSize: number
  selectedRows: Set<number>
  loading: boolean
}

export interface DataTableProps extends VariantProps<typeof dataTableVariants> {
  data: any[]
  columns: DataTableColumn[]
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: boolean
  pageSize?: number
  sortable?: boolean
  selectable?: boolean
  selectableType?: 'single' | 'multiple'
  loading?: boolean
  showRowNumbers?: boolean
  emptyMessage?: string
  class?: string
  onRowClick$?: PropFunction<(row: any, index: number) => void>
  onSelectionChange$?: PropFunction<(selectedRows: any[], selectedIndices: number[]) => void>
  onSortChange$?: PropFunction<(column: string, direction: 'asc' | 'desc') => void>
  onSearchChange$?: PropFunction<(searchTerm: string) => void>
  onPageChange$?: PropFunction<(page: number) => void>
}

// =============================================================================
// MAIN COMPONENT - DataTable optimizado para Qwik
// =============================================================================

export const DataTable = component$<DataTableProps>(({
  data,
  columns,
  variant,
  density,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pagination = true,
  pageSize = 10,
  sortable = true,
  selectable = false,
  selectableType = 'multiple',
  showRowNumbers = false,
  emptyMessage = 'No se encontraron resultados',
  class: className,
  onRowClick$,
  onSelectionChange$,
  onSortChange$,
  onSearchChange$,
  onPageChange$
}) => {
  // =============================================================================
  // STATE MANAGEMENT - Estado reactivo optimizado
  // =============================================================================
  
  const state = useStore<DataTableState>({
    searchTerm: '',
    sortColumn: null,
    sortDirection: 'asc',
    currentPage: 1,
    pageSize: pageSize,
    selectedRows: new Set<number>(),
    loading: loading
  })

  const reactivityTrigger = useSignal(0)

  // =============================================================================
  // DATA PROCESSING - Filtrado, ordenado y paginado
  // =============================================================================

  // Filter data based on search term
  const getFilteredData = () => {
    if (!state.searchTerm) return data
    
    const searchTerm = state.searchTerm.toLowerCase()
    
    return data.filter(row => {
      return columns.some(column => {
        if (!column.accessorKey) return false
        const value = (row as any)[column.accessorKey]
        return String(value).toLowerCase().includes(searchTerm)
      })
    })
  }

  // Sort data
  const getSortedData = (filteredData: any[]) => {
    if (!state.sortColumn) return filteredData
    
    const column = columns.find(col => col.id === state.sortColumn)
    if (!column?.accessorKey) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[column.accessorKey!]
      const bValue = (b as any)[column.accessorKey!]
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return state.sortDirection === 'asc' ? 1 : -1
      if (bValue == null) return state.sortDirection === 'asc' ? -1 : 1
      
      // Type-aware comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return state.sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return state.sortDirection === 'asc' ? 
          aValue.getTime() - bValue.getTime() : 
          bValue.getTime() - aValue.getTime()
      }
      
      // String comparison
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      
      if (aStr < bStr) return state.sortDirection === 'asc' ? -1 : 1
      if (aStr > bStr) return state.sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  // Get current page data
  const getCurrentPageData = () => {
    const filteredData = getFilteredData()
    const sortedData = getSortedData(filteredData)
    
    if (!pagination) return { data: sortedData, totalItems: sortedData.length }
    
    const startIndex = (state.currentPage - 1) * state.pageSize
    const endIndex = startIndex + state.pageSize
    const paginatedData = sortedData.slice(startIndex, endIndex)
    
    return { data: paginatedData, totalItems: sortedData.length }
  }

  const currentData = getCurrentPageData()
  const totalPages = Math.ceil(currentData.totalItems / state.pageSize)

  // =============================================================================
  // EVENT HANDLERS - Optimizados para Qwik
  // =============================================================================

  const handleSearch = $((value: string) => {
    state.searchTerm = value
    state.currentPage = 1
    reactivityTrigger.value++
    
    if (onSearchChange$) {
      onSearchChange$(value)
    }
  })

  const handlePageChange = $((page: number) => {
    state.currentPage = page
    reactivityTrigger.value++
    
    if (onPageChange$) {
      onPageChange$(page)
    }
  })

  const handleSelectAll = $(() => {
    // Implementar lógica de filtrado y ordenamiento directamente aquí
    let processedData = data
    
    // Aplicar filtrado
    if (state.searchTerm) {
      const searchTerm = state.searchTerm.toLowerCase()
      processedData = data.filter(row => {
        return columns.some(column => {
          if (!column.accessorKey) return false
          const value = (row as any)[column.accessorKey]
          return String(value).toLowerCase().includes(searchTerm)
        })
      })
    }
    
    // Aplicar ordenamiento
    if (state.sortColumn) {
      const column = columns.find(col => col.id === state.sortColumn)
      if (column?.accessorKey) {
        processedData = [...processedData].sort((a, b) => {
          const aValue = (a as any)[column.accessorKey!]
          const bValue = (b as any)[column.accessorKey!]

          if (aValue == null && bValue == null) return 0
          if (aValue == null) return state.sortDirection === 'asc' ? 1 : -1
          if (bValue == null) return state.sortDirection === 'asc' ? -1 : 1

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return state.sortDirection === 'asc' ? aValue - bValue : bValue - aValue
          }

          if (aValue instanceof Date && bValue instanceof Date) {
            return state.sortDirection === 'asc' ? 
              aValue.getTime() - bValue.getTime() : 
              bValue.getTime() - aValue.getTime()
          }

          const aStr = String(aValue).toLowerCase()
          const bStr = String(bValue).toLowerCase()

          if (aStr < bStr) return state.sortDirection === 'asc' ? -1 : 1
          if (aStr > bStr) return state.sortDirection === 'asc' ? 1 : -1
          return 0
        })
      }
    }
    
    // Obtener datos de la página actual
    let currentPageData
    if (!pagination) {
      currentPageData = processedData
    } else {
      const startIndex = (state.currentPage - 1) * state.pageSize
      const endIndex = startIndex + state.pageSize
      currentPageData = processedData.slice(startIndex, endIndex)
    }
    
    const startIndex = (state.currentPage - 1) * state.pageSize
    
    // Verificar si todas las filas de la página actual están seleccionadas
    const areAllCurrentPageSelected = currentPageData.every((_, idx) => 
      state.selectedRows.has(startIndex + idx)
    )
    
    if (areAllCurrentPageSelected) {
      // Deseleccionar todas las filas de la página actual
      currentPageData.forEach((_, idx) => {
        state.selectedRows.delete(startIndex + idx)
      })
    } else {
      // Seleccionar todas las filas de la página actual
      currentPageData.forEach((_, idx) => {
        state.selectedRows.add(startIndex + idx)
      })
    }
    
    reactivityTrigger.value++
    
    if (onSelectionChange$) {
      const selectedData = Array.from(state.selectedRows).map(idx => data[idx])
      const selectedIndices = Array.from(state.selectedRows)
      onSelectionChange$(selectedData, selectedIndices)
    }
  })

  const handleRowSelect = $((rowIndex: number) => {
    if (selectableType === 'single') {
      state.selectedRows.clear()
      state.selectedRows.add(rowIndex)
    } else {
      if (state.selectedRows.has(rowIndex)) {
        state.selectedRows.delete(rowIndex)
      } else {
        state.selectedRows.add(rowIndex)
      }
    }
    
    reactivityTrigger.value++
    
    if (onSelectionChange$) {
      const selectedData = Array.from(state.selectedRows).map(idx => data[idx])
      const selectedIndices = Array.from(state.selectedRows)
      onSelectionChange$(selectedData, selectedIndices)
    }
  })

  const handleRowClick = $((row: any, index: number) => {
    if (onRowClick$) {
      onRowClick$(row, index)
    }
  })

  // =============================================================================
  // RENDER FUNCTIONS
  // =============================================================================

  const renderCellValue = (column: DataTableColumn, row: any) => {
    if (column.accessorKey) {
      const value = (row as any)[column.accessorKey]
      
      if (value === null || value === undefined) {
        return <span class="text-muted-foreground">—</span>
      }
      
      // Handle different cell types
      switch (column.cellType) {
        case 'boolean':
          return (
            <Badge variant={value ? 'default' : 'secondary'}>
              {value ? 'Sí' : 'No'}
            </Badge>
          )
        
        case 'date':
          if (value instanceof Date) {
            return value.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }
          return String(value)
        
        case 'number':
          return <span class="font-mono tabular-nums">{Number(value).toLocaleString('es-ES')}</span>
        
        case 'badge':
          return <Badge>{String(value)}</Badge>
        
        default:
          return String(value)
      }
    }
    
    return ''
  }

  // =============================================================================
  // COMPONENT RENDER
  // =============================================================================

  return (
    <div class={cn(dataTableVariants({ variant, density, loading }), className)}>
      {/* Search Bar */}
      {searchable && (
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <Input
              placeholder={searchPlaceholder}
              value={state.searchTerm}
              onInput$={(_, el) => handleSearch(el.value)}
              class="max-w-sm"
              aria-label="Buscar en la tabla"
            />
            {state.searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick$={() => handleSearch('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </Button>
            )}
          </div>
          
          <div class="text-sm text-muted-foreground">
            {currentData.totalItems} resultado{currentData.totalItems !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Data Table */}
      <Table variant={variant} density={density}>
        <TableHeader sticky>
          <TableRow>
            {/* Select All Column */}
            {selectable && selectableType === 'multiple' && (
              <TableHead class="w-[50px]">
                <input
                  type="checkbox"
                  checked={(() => {
                    // Calcular dinámicamente si todas las filas de la página actual están seleccionadas
                    const startIndex = (state.currentPage - 1) * state.pageSize
                    const areAllCurrentPageSelected = currentData.data.length > 0 && 
                      currentData.data.every((_, idx) => state.selectedRows.has(startIndex + idx))
                    return areAllCurrentPageSelected && reactivityTrigger.value >= 0
                  })()}
                  onChange$={handleSelectAll}
                  aria-label="Seleccionar todas las filas"
                  class="h-4 w-4 rounded border-input focus:ring-2 focus:ring-primary"
                />
              </TableHead>
            )}
            
            {/* Row Numbers Column */}
            {showRowNumbers && (
              <TableHead class="w-[60px]" variant="center">
                #
              </TableHead>
            )}
            
            {/* Data Columns */}
            {columns.map((column) => {
              return (
                <TableHead
                  key={column.id}
                  class={cn(
                    column.width && `w-[${column.width}]`,
                    column.hideOnMobile && 'hidden sm:table-cell',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    sortable && column.sortable !== false && 'cursor-pointer select-none hover:bg-muted/50'
                  )}
                  sortable={sortable && column.sortable !== false}
                  sorted={state.sortColumn === column.id ? state.sortDirection : false}
                  onClick$={sortable && column.sortable !== false ? 
                    $(() => {
                      const columnId = column.id
                      const foundColumn = columns.find(col => col.id === columnId)
                      if (!foundColumn || foundColumn.sortable === false) return
                      
                      if (state.sortColumn === columnId) {
                        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
                      } else {
                        state.sortColumn = columnId
                        state.sortDirection = 'asc'
                      }
                      
                      reactivityTrigger.value++
                      
                      if (onSortChange$) {
                        onSortChange$(columnId, state.sortDirection)
                      }
                    }) : undefined
                  }
                >
                  {column.header}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {currentData.data.length === 0 ? (
            <TableRow>
              <TableCell 
                class="h-24 text-center text-muted-foreground"
                colspan={
                  columns.length + 
                  (selectable ? 1 : 0) + 
                  (showRowNumbers ? 1 : 0)
                }
              >
                {loading ? 'Cargando...' : emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            currentData.data.map((row, index) => {
              const globalIndex = (state.currentPage - 1) * state.pageSize + index
              const isSelected = state.selectedRows.has(globalIndex)
              
              return (
                <TableRow
                  key={`row-${globalIndex}`}
                  variant={isSelected ? 'selected' : (onRowClick$ ? 'interactive' : 'default')}
                  data-selected={isSelected}
                  onClick$={onRowClick$ ? $(() => handleRowClick(row, globalIndex)) : undefined}
                >
                  {/* Selection Column */}
                  {selectable && (
                    <TableCell>
                      <input
                        type={selectableType === 'single' ? 'radio' : 'checkbox'}
                        name={selectableType === 'single' ? 'table-selection' : undefined}
                        checked={isSelected && reactivityTrigger.value >= 0}
                        onChange$={() => handleRowSelect(globalIndex)}
                        aria-label={`Seleccionar fila ${index + 1}`}
                        class="h-4 w-4 rounded border-input focus:ring-2 focus:ring-primary"
                      />
                    </TableCell>
                  )}
                  
                  {/* Row Number Column */}
                  {showRowNumbers && (
                    <TableCell variant="center" class="text-muted-foreground">
                      {globalIndex + 1}
                    </TableCell>
                  )}
                  
                  {/* Data Columns */}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      class={cn(
                        column.hideOnMobile && 'hidden sm:table-cell',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                      variant={column.align === 'right' ? 'numeric' : 'default'}
                    >
                      {renderCellValue(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div class="flex items-center justify-between">
          <div class="text-sm text-muted-foreground">
            Mostrando {((state.currentPage - 1) * state.pageSize) + 1} a {Math.min(state.currentPage * state.pageSize, currentData.totalItems)} de {currentData.totalItems} resultados
          </div>
          
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={state.currentPage === 1}
              onClick$={() => handlePageChange(state.currentPage - 1)}
              aria-label="Página anterior"
            >
              ← Anterior
            </Button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, 
                Math.min(
                  totalPages - 6, 
                  state.currentPage - 3
                )
              ) + i
              
              if (pageNum > totalPages) return null
              
              return (
                <Button
                  key={pageNum}
                  variant={state.currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick$={() => handlePageChange(pageNum)}
                  aria-label={`Ir a página ${pageNum}`}
                  aria-current={state.currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              size="sm"
              disabled={state.currentPage === totalPages}
              onClick$={() => handlePageChange(state.currentPage + 1)}
              aria-label="Página siguiente"
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})
