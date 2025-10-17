/**
 * Tipos e interfaces para el sistema de menú de navegación
 * [CITE: ARQUITECTUR_FOLDER.md] - Centraliza todas las definiciones de tipos en src/lib/types/
 */

export interface MenuItem {
  text: string;
  href: string;
  items?: MenuItem[];
}

export type MenuItems = MenuItem[];