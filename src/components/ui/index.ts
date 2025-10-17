// =============================================================================
// UI COMPONENTS INDEX - Punto de entrada centralizado
// =============================================================================
// 
// Archivo de barril (barrel export) que proporciona una API limpia y 
// organizada para todos los componentes de UI del sistema.
// 
// Usando export * para evitar duplicaciones y errores de nombrado
//
// =============================================================================

// --- BASE COMPONENTS ---
export * from './button'
export * from './input'
export * from './badge'
export * from './avatar'

// --- FEEDBACK COMPONENTS ---
export * from './alert'
export * from './label'

// --- LAYOUT COMPONENTS ---
export * from './card'
export * from './modal'
export * from './table'

// --- DATA COMPONENTS ---
export * from './data-table'

// --- NAVIGATION COMPONENTS ---
export * from './tabs'
export * from './dropdown-menu'
export * from './accordion'

// --- FEEDBACK COMPONENTS ---
export * from './toast'

// =============================================================================
// UTILITY EXPORTS
// =============================================================================
export { cn } from '../../lib/utils'
