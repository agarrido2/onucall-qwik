/**
 * Sitemap XML Dinámico
 * 
 * Genera el sitemap.xml con todas las rutas públicas de la aplicación.
 * Los motores de búsqueda usan este archivo para descubrir contenido.
 * 
 * [CITE: SEO_A11Y_GUIDE.md - Regla 5.2]
 * [CITE: CAPITULO-7.md - Endpoints de API]
 */

import type { RequestHandler } from '@builder.io/qwik-city';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

export const onGet: RequestHandler = async ({ send, url }) => {
  // Base URL del sitio (usa el dominio de producción)
  const baseUrl = url.origin;
  
  // URLs estáticas de la aplicación
  const staticUrls: SitemapURL[] = [
    {
      loc: `${baseUrl}/`,
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString(),
    },
    // Añade aquí más URLs cuando existan más páginas
    // {
    //   loc: `${baseUrl}/pricing`,
    //   changefreq: 'monthly',
    //   priority: '0.8',
    // },
    // {
    //   loc: `${baseUrl}/blog`,
    //   changefreq: 'weekly',
    //   priority: '0.7',
    // },
  ];

  // TODO: Cuando tengas contenido dinámico (blog posts, productos, etc.),
  // consulta la base de datos aquí y añádelo a dynamicUrls
  const dynamicUrls: SitemapURL[] = [];
  
  // Ejemplo para contenido dinámico:
  // const posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true));
  // const dynamicUrls = posts.map(post => ({
  //   loc: `${baseUrl}/blog/${post.slug}`,
  //   lastmod: post.updatedAt.toISOString(),
  //   changefreq: 'monthly' as const,
  //   priority: '0.6',
  // }));

  // Combinar URLs estáticas y dinámicas
  const allUrls = [...staticUrls, ...dynamicUrls];

  // Generar XML del sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  // Enviar respuesta con headers correctos
  send(new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache de 1 hora
    },
  }));
};
