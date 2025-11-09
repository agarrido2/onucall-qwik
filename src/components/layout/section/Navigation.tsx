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
        class="text-[14px] font-bold text-gray-300 transition-colors duration-200 hover:text-white inline-flex items-center gap-1"
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
            "w-4 h-4 transition-transform duration-200": true,
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
          class="absolute top-full left-0 mt-2 w-56 bg-gray-900/98 backdrop-blur-2xl border border-white/30 rounded-md shadow-xl p-2 z-50"
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
              class="block px-4 py-2 text-sm text-white hover:bg-white/20 rounded-md transition-colors"
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
          class="inline-flex items-center justify-center rounded-md border-2 border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
        >
          Zona Clientes
        </Link>
        <Link
          href="/#contacto"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Contactar
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 md:hidden"
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
            "absolute left-0 right-0 top-full mt-4 py-4 transition-all duration-300 md:hidden": true,
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
                    <Collapsible.Trigger class="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-300 hover:text-white">
                      {item.text}
                      <svg
                        class="w-4 h-4 transition-transform duration-200"
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
                    <Collapsible.Content class="pt-2 pl-4 space-y-2">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href || "#"}
                          class="block py-1 text-xs text-gray-300 hover:text-white transition-colors"
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
            <div class="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <Link
                href="/dashboard"
                class="inline-flex items-center justify-center rounded-md border-2 border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 w-full"
              >
                Zona Clientes
              </Link>
              <Link
                href="/#contacto"
                class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full"
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