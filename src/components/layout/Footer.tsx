/**
 * Footer Component - Landing Page Footer
 * 
 * Pie de página con diseño multi-columna responsive.
 * Incluye información de la empresa, enlaces de navegación y redes sociales.
 * 
 * [CITE: UX_GUIDE.md] - Información secundaria y legal organizada
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Grid responsive y utilidades de Tailwind v4
 */

import { component$, useStylesScoped$ } from '@builder.io/qwik';


export const Footer = component$(() => {
  useStylesScoped$(`
    .footer-link {
      transition: all 0.2s ease;
    }
    
    .footer-link:hover {
      color: rgb(156 163 175);
      transform: translateX(2px);
    }
    
    .social-icon {
      transition: all 0.2s ease;
    }
    
    .social-icon:hover {
      color: rgb(156 163 175);
      transform: translateY(-2px);
    }
  `);

  return (
    <footer class="bg-gray-950 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-screen-xl mx-auto">
        {/* Grid Principal */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1 - Marca y Redes Sociales */}
          <div class="space-y-4">
            {/* Logo */}
            <p class="text-gray-500 text-sm leading-relaxed">
              Tu mejor agente comercial, 24/7.
            </p>
            
            {/* Iconos de Redes Sociales */}
            <div class="flex space-x-4 pt-4">
              {/* LinkedIn */}
              <a href="#" class="social-icon" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a href="#" class="social-icon" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Facebook */}
              <a href="#" class="social-icon" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 - Producto */}
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Producto</h3>
            <ul class="space-y-3">
              <li>
                <a href="#caracteristicas" class="footer-link text-sm">
                  Características
                </a>
              </li>
              <li>
                <a href="#precios" class="footer-link text-sm">
                  Precios
                </a>
              </li>
              <li>
                <a href="#casos-de-uso" class="footer-link text-sm">
                  Casos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Empresa */}
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Empresa</h3>
            <ul class="space-y-3">
              <li>
                <a href="#nosotros" class="footer-link text-sm">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#partners" class="footer-link text-sm">
                  Partners
                </a>
              </li>
              <li>
                <a href="#contacto" class="footer-link text-sm">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Legal */}
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul class="space-y-3">
              <li>
                <a href="#privacidad" class="footer-link text-sm">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#terminos" class="footer-link text-sm">
                  Términos de Servicio
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior - Copyright */}
        <div class="border-t border-gray-800 mt-8 pt-8">
          <p class="text-center text-gray-500 text-sm">
            © 2025 onucall. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
});