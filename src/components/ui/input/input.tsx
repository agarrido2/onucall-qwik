import { 
  component$, 
  useStylesScoped$,
  type PropFunction 
} from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input hover:border-ring/50 focus:border-ring',
        destructive: 'border-destructive text-foreground focus-visible:ring-destructive placeholder:text-muted-foreground/70 hover:border-destructive/80 focus:border-destructive',
        success: 'border-success focus-visible:ring-success text-foreground placeholder:text-muted-foreground/70 hover:border-success/80 focus:border-success',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-1 text-xs',
        lg: 'h-11 px-4 py-3 text-base',
        xl: 'h-12 px-4 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps extends VariantProps<typeof inputVariants> {
  class?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  value?: string
  name?: string
  id?: string
  required?: boolean
  readonly?: boolean
  autoComplete?: string
  autoFocus?: boolean
  onInput$?: PropFunction<(event: Event, element: HTMLInputElement) => void>
  onChange$?: PropFunction<(event: Event, element: HTMLInputElement) => void>
  onFocus$?: PropFunction<(event: FocusEvent, element: HTMLInputElement) => void>
  onBlur$?: PropFunction<(event: FocusEvent, element: HTMLInputElement) => void>
  onKeyDown$?: PropFunction<(event: KeyboardEvent, element: HTMLInputElement) => void>
}

/**
 * Input Component - Super Optimizado
 * 
 * ✅ Siguiendo patrones del Toast (referencia de éxito)
 * ✅ useStylesScoped$ para micro-interacciones
 * ✅ Props explícitas y seguras (sin spreading)
 * ✅ Tipos completos y específicos
 * ✅ Estados visuales mejorados
 */
export const Input = component$<InputProps>(({ 
  variant, 
  size, 
  class: className, 
  type = 'text',
  placeholder,
  disabled,
  value,
  name,
  id,
  required,
  readonly,
  autoComplete,
  autoFocus,
  onInput$,
  onChange$,
  onFocus$,
  onBlur$,
  onKeyDown$
}) => {

  useStylesScoped$(`
    .input-enhanced {
      position: relative;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .input-enhanced:focus {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .input-enhanced:focus-within {
      transform: translateY(-1px);
    }

    .input-enhanced::placeholder {
      transition: all 0.2s ease;
    }

    .input-enhanced:focus::placeholder {
      opacity: 0.7;
      transform: translateX(4px);
    }

    .input-enhanced:disabled {
      transform: none;
      box-shadow: none;
    }

    /* Estados de validación */
    .input-enhanced[data-variant="destructive"] {
      animation: shake 0.3s ease-in-out;
    }

    .input-enhanced[data-variant="success"] {
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
  `)

  return (
    <input
      type={type}
      class={cn(inputVariants({ variant, size }), 'input-enhanced', className)}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      name={name}
      id={id}
      required={required}
      readOnly={readonly}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      data-variant={variant}
      onInput$={onInput$}
      onChange$={onChange$}
      onFocus$={onFocus$}
      onBlur$={onBlur$}
      onKeyDown$={onKeyDown$}
    />
  )
})
