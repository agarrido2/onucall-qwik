/**
 * Navigation Component - Sistema de Navegación del Header
 * 
 * Componente especializado que maneja toda la lógica de navegación tanto
 * para desktop como para móvil. Incluye dropdowns, menú móvil y acciones.
 * 
 * [CITE: ARQUITECTUR_FOLDER.md] - Separación de componentes en section/
 * [CITE: UX_GUIDE.md] - Micro-interacciones y navegación fluida
 * 
 * Características:
 * - Navegación desktop y móvil unificada
 * - DropdownMenu integrado del sistema UI
 * - Estado compartido con Header para glassmorphism
 * - Acciones de usuario (login, CTA)
 */

import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { MENU_ITEMS } from "~/lib/menu-config";
import { Button } from "~/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu/dropdown-menu";

interface NavigationProps {
  isScrolled: boolean;
}

export const Navigation = component$<NavigationProps>(({ isScrolled }) => {
  const mobileMenuOpen = useSignal(false);

  // Función para toggle del menú móvil
  const toggleMobileMenu = $(() => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  });

  // Obtener elementos del menú desde configuración centralizada
  // [CITE: ARQUITECTUR_FOLDER.md] - Configuración en src/lib/
  const menuItems = MENU_ITEMS;

  return (
    <>
      {/* Centro - Navegación Desktop */}
      <nav class="hidden md:flex">
        <div
          class={{
            "flex items-center space-x-6 rounded-full px-6 py-2 transition-all duration-300": true,
            "border border-white/20": !isScrolled,
            "border border-white/30": isScrolled,
          }}
        >
          {menuItems.map((item, index) => (
            <div key={index} class="relative">
              {item.items && item.items.length > 0 ? (
                // Dropdown para elementos con hijos (Sectores, Recursos)
                <DropdownMenu>
                  <DropdownMenuTrigger
                    variant="ghost"
                    size="sm"
                    class="h-auto p-0 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-transparent hover:text-white"
                  >
                    {item.text}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    class="w-56 rounded-md border border-white/30 bg-gray-900/98 text-white shadow-xl backdrop-blur-2xl"
                  >
                    {item.items.map((subItem, subIndex) => (
                      <DropdownMenuItem
                        key={subIndex}
                        class="hover:bg-white/20 hover:text-white"
                      >
                        <Link
                          href={subItem.href || "#"}
                          class="w-full text-sm"
                        >
                          {subItem.text}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Enlace simple para elementos sin hijos
                <Link
                  href={item.href || "#"}
                  class="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
                >
                  {item.text}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Derecha - Acciones Desktop */}
      <div class="hidden items-center space-x-4 md:flex">
        <a
          href="#login"
          class={{
            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200": true,
            "border border-white/20 text-gray-300 hover:text-white": !isScrolled,
            "border border-white/30 text-gray-300 hover:text-white": isScrolled,
          }}
        >
          Iniciar Sesión
        </a>
        <Button
          variant="default"
          size="sm"
          class="transform rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-500"
        >
          Prueba Onucall
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        class="p-2 text-white transition-colors duration-200 hover:bg-transparent hover:text-gray-300 md:hidden"
        onClick$={toggleMobileMenu}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-label="Abrir menú de navegación"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </Button>

      {/* Mobile Menu */}
      {mobileMenuOpen.value && (
        <div
          class={{
            "absolute left-0 right-0 top-full mt-4 py-4 transition-all duration-300 md:hidden": true,
            "border-t border-white/20": !isScrolled,
            "border-t border-white/30": isScrolled,
          }}
        >
          <nav class="flex flex-col space-y-4">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.items && item.items.length > 0 ? (
                  // Dropdown para móvil usando DropdownMenu
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      variant="ghost"
                      size="sm"
                      class="flex h-auto w-full items-center justify-start py-2 text-sm font-medium text-gray-300 hover:bg-transparent hover:text-white"
                    >
                      {item.text}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      class="ml-4 w-full rounded-md border border-white/30 bg-gray-900/98 text-white shadow-xl backdrop-blur-2xl"
                    >
                      {item.items.map((subItem, subIndex) => (
                        <DropdownMenuItem
                          key={subIndex}
                          class="hover:bg-white/20 hover:text-white"
                        >
                          <Link
                            href={subItem.href || "#"}
                            class="w-full text-xs"
                          >
                            {subItem.text}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Enlace simple para móvil
                  <Link
                    href={item.href || "#"}
                    class="block py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    {item.text}
                  </Link>
                )}
              </div>
            ))}
            <div class="flex flex-col space-y-3 pt-4">
              <Link
                href="/login"
                class="py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
              >
                Iniciar Sesión
              </Link>
              <Button
                variant="default"
                size="sm"
                class="rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500"
              >
                Empieza Gratis
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
});