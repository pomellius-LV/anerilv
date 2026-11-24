// Cloudflare Pages Root Edge Middleware (v1.17 SEO)
// Transforms initial HTML responses with per-route <title>, meta descriptions,
// canonical + hreflang tags, JSON-LD schemas, and semantic #root SSR content
// before JavaScript executes — giving Googlebot instant crawlable HTML on every URL.
//
// IMPORTANT: Imports ONLY pure zero-dependency data from ../data/seoRoutes (no Vite-only globs).

import { getEdgeSeoPayload } from '../data/seoRoutes';

interface HtmlRewriterElement {
  setAttribute(name: string, value: string): void;
  setInnerContent(content: string, options?: { html?: boolean }): void;
  append(content: string, options?: { html?: boolean }): void;
  remove(): void;
}

interface HtmlRewriterInstance {
  on(selector: string, handlers: { element?(element: HtmlRewriterElement): void }): HtmlRewriterInstance;
  transform(response: Response): Response;
}

declare const HTMLRewriter: {
  new (): HtmlRewriterInstance;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForScript(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

export const onRequest = async (context: {
  request: Request;
  next: () => Promise<Response>;
}) => {
  const { request } = context;

  // Strictly process only GET requests for page routes
  if (request.method !== 'GET') {
    return context.next();
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Immediate bypass for API endpoints, admin panel, and static asset extensions
  if (
    path.startsWith('/api/') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path.startsWith('/ru/admin') ||
    path.startsWith('/en/admin') ||
    path.startsWith('/lv/admin') ||
    /\.[a-z0-9]{1,8}$/i.test(path)
  ) {
    return context.next();
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Fallback safely if HTMLRewriter is unavailable in non-edge environments
  if (typeof HTMLRewriter === 'undefined') {
    return response;
  }

  const seo = getEdgeSeoPayload(path);

  const headInjections = [
    `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`,
    ...seo.alternates.map(
      alt =>
        `<link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}" />`
    ),
    ...seo.schemas.map(
      schema =>
        `<script type="application/ld+json">${escapeJsonForScript(schema)}</script>`
    )
  ].join('\n    ');

  const navHeading =
    seo.lang === 'lv'
      ? 'Pakalpojumi Rīgā — Salons Aneri'
      : seo.lang === 'ru'
      ? 'Услуги в Риге — Салон Aneri'
      : 'Services in Riga — Aneri Salon';

  const pricesLabel =
    seo.lang === 'lv'
      ? 'Pilns pakalpojumu cenrādis'
      : seo.lang === 'ru'
      ? 'Полный прайс-лист и цены'
      : 'Full Service Price List';

  const parkingNote =
    seo.lang === 'lv'
      ? 'Latgales iela 264, Rīga (Ķengarags) · Bezmaksas privātā stāvvieta pie salona · +371 27580047'
      : seo.lang === 'ru'
      ? 'ул. Латгалес 264, Рига (Кенгарагс) · Бесплатная частная парковка у входа · +371 27580047'
      : 'Latgales iela 264, Riga (Kengarags) · Free private parking at entrance · +371 27580047';

  // Semantic SSR fallback inside <div id="root"> for Googlebot/crawlers before React mounts
  const ssrFallbackHtml = `<main style="max-width:960px;margin:0 auto;padding:48px 20px;font-family:sans-serif;color:#1c1917;">
  <p style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#9f1239;font-weight:700;">Salons Aneri · Rīga</p>
  <h1 style="font-size:36px;line-height:1.2;margin:12px 0;">${escapeHtml(seo.h1)}</h1>
  <p style="font-size:18px;line-height:1.6;color:#44403c;margin-bottom:20px;">${escapeHtml(seo.lead)}</p>
  <p style="font-size:14px;color:#57534e;margin-bottom:28px;">${escapeHtml(parkingNote)}</p>
  <nav aria-label="${escapeHtml(navHeading)}">
    <h2 style="font-size:20px;margin-bottom:12px;">${escapeHtml(navHeading)}</h2>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:12px;">
      ${seo.thematicLinks
        .map(
          item =>
            `<li><a href="${escapeHtml(item.href)}" style="color:#9f1239;text-decoration:underline;">${escapeHtml(item.label)}</a></li>`
        )
        .join('\n      ')}
      <li><a href="${escapeHtml(seo.pricesHref)}" style="color:#9f1239;text-decoration:underline;">${escapeHtml(pricesLabel)}</a></li>
    </ul>
  </nav>
</main>`;

  return new HTMLRewriter()
    .on('html', {
      element(el) {
        el.setAttribute('lang', seo.lang);
      }
    })
    .on('title', {
      element(el) {
        el.setInnerContent(seo.title);
      }
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute('content', seo.description);
      }
    })
    .on('meta[name="keywords"]', {
      element(el) {
        el.setAttribute('content', seo.keywords);
      }
    })
    .on('meta[name="robots"]', {
      element(el) {
        el.setAttribute('content', seo.robots);
      }
    })
    .on('meta[property="og:type"]', {
      element(el) {
        el.setAttribute('content', seo.ogType);
      }
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute('content', seo.title);
      }
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute('content', seo.description);
      }
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute('content', seo.canonicalUrl);
      }
    })
    .on('meta[property="og:image"]', {
      element(el) {
        el.setAttribute('content', seo.ogImage);
      }
    })
    .on('meta[property="og:locale"]', {
      element(el) {
        el.setAttribute('content', seo.ogLocale);
      }
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute('content', seo.title);
      }
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute('content', seo.description);
      }
    })
    .on('meta[name="twitter:url"]', {
      element(el) {
        el.setAttribute('content', seo.canonicalUrl);
      }
    })
    .on('meta[name="twitter:image"]', {
      element(el) {
        el.setAttribute('content', seo.ogImage);
      }
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.remove();
      }
    })
    .on('link[rel="alternate"]', {
      element(el) {
        el.remove();
      }
    })
    .on('head', {
      element(el) {
        el.append(headInjections, { html: true });
      }
    })
    .on('div#root', {
      element(el) {
        el.setInnerContent(ssrFallbackHtml, { html: true });
      }
    })
    .transform(response);
};
