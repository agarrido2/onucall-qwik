import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Collapsible } from "@qwik-ui/headless";
import { MENU_ITEMS } from "~/lib/menu-config";

// Componente Dropdown para desktop
const Dropdown = component$<{ item: any }>(({ item }) => {
  const isOpen = useSignal(false);

  return (
    <div class="relative">
      <button
        class="inline-flex items-center gap-1 text-[14px] font-bold text-gray-300 transition-colors duration-200 hover:text-white"
        onClick$={() => {
          isOpen.value = !isOpen.value;
        }}
        onMouseEnter$={() => {
          isOpen.value = true;
        }}
        onMouseLeave$={() => {
          isOpen.value = false;
        }}
      >
        {item.text}
        <svg
          class={{
            "h-4 w-4 transition-transform duration-200": true,
            "rotate-180": isOpen.value,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen.value && (
        <div
          class="absolute top-full left-0 z-50 mt-2 w-56 rounded-md border border-white/30 bg-gray-900/98 p-2 shadow-xl backdrop-blur-2xl"
          onMouseEnter$={() => {
            isOpen.value = true;
          }}
          onMouseLeave$={() => {
            isOpen.value = false;
          }}
        >
          {item.items.map((subItem: any, subIndex: number) => (
            <Link
              key={subIndex}
              href={subItem.href || "#"}
              class="block rounded-md px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
              {subItem.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});

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
            "flex items-center space-x-6 rounded-full px-6 py-3 transition-all duration-300": true,
            "border-3 border-white/20": !isScrolled,
            "border-3 border-white/30": isScrolled,
          }}
        >
          {menuItems.map((item, index) => (
            <div key={index} class="relative">
              {item.items && item.items.length > 0 ? (
                // Dropdown con estado controlado para desktop
                <Dropdown item={item} />
              ) : (
                // Enlace simple para elementos sin hijos
                <Link
                  href={item.href || "#"}
                  class="text-[14px] font-bold text-gray-300 transition-colors duration-200 hover:text-white"
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
        <Link
          href="/dashboard"
          class="inline-flex items-center justify-center rounded-md border-2 border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:outline-none"
        >
          Zona Clientes
        </Link>
        <Link
          href="/#contacto"
          class="bg-primary text-primary-foreground hover:bg-primary-light focus:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Contactar
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none md:hidden"
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
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen.value && (
        <div
          class={{
            "absolute top-full right-0 left-0 mt-4 py-4 transition-all duration-300 md:hidden": true,
            "border-t border-white/20": !isScrolled,
            "border-t border-white/30": isScrolled,
          }}
        >
          <nav class="flex flex-col space-y-4">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.items && item.items.length > 0 ? (
                  // Collapsible con @qwik-ui/headless para móvil
                  <Collapsible.Root class="border-b border-white/10 pb-2">
                    <Collapsible.Trigger class="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-300 hover:text-white">
                      {item.text}
                      <svg
                        class="h-4 w-4 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Collapsible.Trigger>
                    <Collapsible.Content class="space-y-2 pt-2 pl-4">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href || "#"}
                          class="block py-1 text-xs text-gray-300 transition-colors hover:text-white"
                        >
                          {subItem.text}
                        </Link>
                      ))}
                    </Collapsible.Content>
                  </Collapsible.Root>
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
            <div class="flex flex-col space-y-3 border-t border-white/20 pt-4">
              <Link
                href="/dashboard"
                class="inline-flex w-full items-center justify-center rounded-md border-2 border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:outline-none"
              >
                Zona Clientes
              </Link>
              <Link
                href="/#contacto"
                class="bg-primary text-primary-foreground hover:bg-primary-light focus:ring-ring inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Contactar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
});
