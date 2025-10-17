/**
 * ThemeToggle Component - Super Optimizado
 * 
 * ✅ Siguiendo patrones del Toast (referencia de éxito)
 * ✅ useTask$ en lugar de useVisibleTask$ innecesario
 * ✅ useStylesScoped$ para estilos custom
 * ✅ Manejo seguro de SSR/Cliente
 * ✅ Gestión de estado reactiva
 * 
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Sección 3.3 Implementación del Interruptor de Tema
 * [CITE: UX_GUIDE.md] - Feedback inmediato en interacciones
 */

import { 
  component$, 
  useSignal, 
  useTask$, 
  $, 
  useStylesScoped$ 
} from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

// --- VARIANTS ---
const themeToggleVariants = cva(
  'relative inline-flex items-center justify-center rounded-lg border transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-background hover:bg-muted border-border',
        floating: 'bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hover:shadow-xl',
      },
      size: {
        sm: 'h-8 w-8 text-sm',
        default: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// --- PROPS ---
export interface ThemeToggleProps extends VariantProps<typeof themeToggleVariants> {
  class?: string
  position?: 'static' | 'fixed'
}

export const ThemeToggle = component$<ThemeToggleProps>(({ 
  variant = 'default', 
  size = 'default',
  class: className,
  position = 'static'
}) => {
  const theme = useSignal<'light' | 'dark'>('light')
  const isClient = useSignal(false)

  useStylesScoped$(`
    .theme-toggle-icon {
      transition: transform 0.2s ease-in-out;
    }
    
    .theme-toggle:hover .theme-toggle-icon {
      transform: scale(1.1) rotate(15deg);
    }
    
    .theme-toggle-floating {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 50;
    }
    
    .theme-bounce-enter {
      animation: theme-bounce 0.3s ease-out;
    }
    
    @keyframes theme-bounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `)

  // Initialize theme on client - usando useTask$ como en Toast
  useTask$(({ cleanup }) => {
    // Solo ejecutar en cliente
    if (typeof window === 'undefined') return

    isClient.value = true
    
    // Leer tema guardado
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    theme.value = initialTheme
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')

    // Escuchar cambios del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        theme.value = newTheme
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    cleanup(() => mediaQuery.removeEventListener('change', handleSystemChange))
  })

  const toggleTheme = $(() => {
    if (typeof window === 'undefined') return

    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  })

  const getIcon = () => {
    if (!isClient.value) return '🌓' // Neutral icon for SSR
    return theme.value === 'light' ? '🌙' : '☀️'
  }

  const getLabel = () => {
    if (!isClient.value) return 'Alternar tema'
    return `Cambiar a modo ${theme.value === 'light' ? 'oscuro' : 'claro'}`
  }

  return (
    <button
      type="button"
      class={`${themeToggleVariants({ variant, size })} theme-toggle ${position === 'fixed' ? 'theme-toggle-floating' : ''} ${className || ''}`}
      onClick$={toggleTheme}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <span class={`theme-toggle-icon inline-block ${isClient.value ? 'theme-bounce-enter' : ''}`}>
        {getIcon()}
      </span>
    </button>
  )
})
