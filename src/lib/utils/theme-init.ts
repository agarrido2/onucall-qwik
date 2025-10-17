/**
 * Theme Initialization Script
 * 
 * Este script se ejecuta ANTES del render de React/Qwik para prevenir
 * el "flash" de tema incorrecto (FOUC - Flash of Unstyled Content).
 * 
 * Se debe incluir en el <head> del documento mediante un script inline.
 * 
 * [CITE: TAILWIND_QWIK_GUIDE.md] - Prevención de flash de tema
 */

export const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Error initializing theme:', e);
  }
})();
`;
