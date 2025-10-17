/**
 * Configuración del menú principal de navegación
 * 
 * [CITE: ARQUITECTUR_FOLDER.md] - src/lib/ es para lógica de negocio y configuraciones
 * 
 * Esta configuración está basada en el contenido de src/menu.md pero optimizada
 * para Qwik's performance y resumability (zero hydration overhead).
 */

import type { MenuItems } from './types/menu';

export const MENU_ITEMS: MenuItems = [
  {
    text: "Sectores",
    href: "/sectores/",
    items: [
      { text: "Concesionarios", href: "/sectores/concesionarios/" },
      { text: "Retail y Distribuidoras", href: "/sectores/retail-distribuidoras/" },
      { text: "Inmobiliarias", href: "/sectores/inmobiliarias/" },
      { text: "Educación", href: "/sectores/educacion/" },
      { text: "Alquiladoras", href: "/sectores/alquiladoras/" },
      { text: "Servicios", href: "/sectores/servicios/" }
    ]
  },
  { 
    text: "¿Cómo funciona?", 
    href: "/como-funciona/" 
  },
  { 
    text: "Empleados IA", 
    href: "/empleados-ia/" 
  },
  { 
    text: "Precios", 
    href: "/precios/" 
  },
  { 
    text: "Nosotros", 
    href: "/nosotros/" 
  },
  {
    text: "Recursos",
    href: "/recursos/",
    items: [
      { text: "Blog", href: "/recursos/blog/" },
      { text: "Casos de éxitos", href: "/recursos/casos-exito/" },
      { text: "Calculadora ROI", href: "/recursos/calculadora-roi/" },
      { text: "Centro de Ayuda", href: "/recursos/centro-ayuda/" }
    ]
  }
] as const;