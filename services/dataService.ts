import { Content, Language, PriceSection } from '../types';
import { contentData } from '../data/content';

export interface AdminServiceItem {
  id: string;
  category_id: string;
  subcategory_title: string;
  order_num?: number;
  price: string;
  old_price?: string | null;
  duration?: string | null;
  is_active: number;
  name?: string;
  name_lv?: string;
  name_ru?: string;
  name_en?: string;
  subcategory_lv?: string;
  subcategory_ru?: string;
  subcategory_en?: string;
  updated_at?: string;
}

// Deterministic ID generator matching 0002_seed_full_catalog.sql
export function generateDeterministicServiceId(sectionId: string, categoryTitle: string, serviceName: string): string {
  const clean = (text: string) => text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[āá]/g, 'a')
    .replace(/[ēé]/g, 'e')
    .replace(/[īí]/g, 'i')
    .replace(/[ūú]/g, 'u')
    .replace(/[č]/g, 'c')
    .replace(/[ģ]/g, 'g')
    .replace(/[ķ]/g, 'k')
    .replace(/[ļ]/g, 'l')
    .replace(/[ņ]/g, 'n')
    .replace(/[š]/g, 's')
    .replace(/[ž]/g, 'z')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);

  return `${sectionId}_${clean(categoryTitle)}_${clean(serviceName)}`;
}

class DataService {
  private listeners: Set<() => void> = new Set();
  // Real service ID -> updated price string
  private livePriceById: Record<string, string> = {};
  // Real service name -> updated price string (for quick name lookups)
  private livePriceByName: Record<string, string> = {};
  
  public isD1Connected = false;
  public isUsingFallback = true;
  public lastSyncTime: Date | null = null;
  public d1Error: string | null = null;

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify() {
    this.listeners.forEach(fn => fn());
  }

  // Fetch live public services from Cloudflare Pages API
  public async fetchLiveServices(lang: Language): Promise<boolean> {
    try {
      const res = await fetch(`/api/public/services?lang=${lang}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache'
      });

      if (!res.ok) {
        this.isD1Connected = false;
        this.isUsingFallback = true;
        this.d1Error = `HTTP ${res.status}: Cloudflare D1 neatbild`;
        this.notify();
        return false;
      }

      const data = await res.json();
      if (data && data.status === 'ok' && Array.isArray(data.services) && data.services.length > 0) {
        this.isD1Connected = true;
        this.isUsingFallback = false;
        this.lastSyncTime = new Date();
        this.d1Error = null;

        data.services.forEach((srv: any) => {
          if (srv.id && srv.price) {
            this.livePriceById[srv.id] = srv.price;
          }
          if (srv.name && srv.price) {
            this.livePriceByName[srv.name] = srv.price;
          }
        });

        this.notify();
        return true;
      } else {
        // D1 database table exists but is empty or unseeded
        this.isD1Connected = data.status === 'ok';
        this.isUsingFallback = true;
        this.notify();
        return false;
      }
    } catch (e: any) {
      this.isD1Connected = false;
      this.isUsingFallback = true;
      this.d1Error = e.message || 'Tīkla kļūda savienojumā ar D1';
      this.notify();
      return false;
    }
  }

  // Fetch complete services list with real IDs for Admin Panel
  public async fetchAdminServices(): Promise<{
    ok: boolean;
    services: AdminServiceItem[];
    error?: string;
    isD1Connected: boolean;
  }> {
    try {
      const res = await fetch('/api/admin/services', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache'
      });

      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          services: [],
          error: 'Piekļuve liegta: Nepieciešama Cloudflare Access autorizācija (pomellius@gmail.com).',
          isD1Connected: false
        };
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return {
          ok: false,
          services: [],
          error: errData.error || errData.message || `Servera kļūda (${res.status})`,
          isD1Connected: false
        };
      }

      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.services)) {
        this.isD1Connected = true;
        this.isUsingFallback = false;
        // Cache prices
        data.services.forEach((srv: AdminServiceItem) => {
          if (srv.id && srv.price) {
            this.livePriceById[srv.id] = srv.price;
          }
          if (srv.name_lv && srv.price) {
            this.livePriceByName[srv.name_lv] = srv.price;
          }
        });
        return {
          ok: true,
          services: data.services,
          isD1Connected: true
        };
      }

      return {
        ok: false,
        services: [],
        error: data.message || 'D1 datubāze nav piesaistīta Cloudflare Pages projektam.',
        isD1Connected: false
      };
    } catch (e: any) {
      return {
        ok: false,
        services: [],
        error: `Savienojuma kļūda: ${e.message}`,
        isD1Connected: false
      };
    }
  }

  // Save price override to Cloudflare D1
  // Strictly requires real serviceId, verifies response, and NEVER fakes success
  public async updatePrice(
    serviceId: string,
    newPrice: string,
    nameLv?: string
  ): Promise<{ ok: boolean; id?: string; price?: string; error?: string; message?: string }> {
    if (!serviceId || serviceId.trim() === '') {
      return { ok: false, error: 'Pakalpojuma ID trūkst. Saglabāšana apturēta.' };
    }

    if (!newPrice || newPrice.trim() === '') {
      return { ok: false, error: 'Cenas vērtība nevar būt tukša.' };
    }

    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: serviceId.trim(),
          price: newPrice.trim(),
          name_lv: nameLv
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        return {
          ok: false,
          error: data.error || data.message || `Kļūda ${res.status}: Neizdevās saglabāt cenu D1 datubāzē.`
        };
      }

      // Successful D1 write confirmed! Update memory cache and notify public UI
      this.livePriceById[serviceId.trim()] = newPrice.trim();
      if (nameLv) {
        this.livePriceByName[nameLv] = newPrice.trim();
      }
      this.notify();

      return {
        ok: true,
        id: serviceId.trim(),
        price: newPrice.trim(),
        message: data.message || 'Cena veiksmīgi saglabāta Cloudflare D1 datubāzē.'
      };
    } catch (e: any) {
      return {
        ok: false,
        error: `Tīkla kļūda: ${e.message}. Izmaiņas netika saglabātas D1 datubāzē.`
      };
    }
  }

  public isPreviewHost(): boolean {
    if (typeof window === 'undefined') return false;
    const host = window.location.hostname.toLowerCase();
    return (
      host.endsWith('.run.app') ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.')
    );
  }

  // Check Cloudflare Access identity
  public async checkAdminAuth(): Promise<{
    authenticated: boolean;
    email?: string;
    error?: string;
    reason?: 'preview_env' | 'access_redirect' | 'unauthorized' | 'network';
  }> {
    try {
      const res = await fetch('/api/admin/auth', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache',
        redirect: 'manual'
      });

      // Cloudflare Access login redirect intercepted on browser fetch
      if (res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)) {
        return {
          authenticated: false,
          reason: 'access_redirect',
          error: 'Cloudflare Access pieprasa atkārtotu sesijas apstiprinājumu. Nospiediet pogu "Ieiet caur Cloudflare Access (/admin)", lai atvērtu pieteikšanās logu.'
        };
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        if (this.isPreviewHost()) {
          return {
            authenticated: false,
            reason: 'preview_env',
            error: 'AI Studio priekšskatījuma vidē (run.app / localhost) nedarbojas Cloudflare Zero Trust un D1 funkcijas. Autorizācija strādā tikai publicētajā Cloudflare vietnē (aneri.lv/admin).'
          };
        }
        return {
          authenticated: false,
          reason: 'access_redirect',
          error: 'Serveris atgrieza HTML nevis JSON. Atveriet /admin pilnā lapā, lai izietu Cloudflare Access pārbaudi.'
        };
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          authenticated: false,
          reason: 'unauthorized',
          error: data.message || data.error || 'Nav autorizēts Cloudflare Access'
        };
      }

      const data = await res.json();
      return {
        authenticated: !!data.authenticated,
        email: data.user?.email
      };
    } catch (e: any) {
      return {
        authenticated: false,
        reason: this.isPreviewHost() ? 'preview_env' : 'network',
        error: e.message
      };
    }
  }

  // Merges bundled contentData with live D1 prices
  public getMergedContent(lang: Language): Content {
    const baseContent = contentData[lang];
    if (!baseContent) return contentData['lv'];

    const updatedSections: PriceSection[] = baseContent.prices.sections.map(section => ({
      ...section,
      categories: section.categories.map(cat => ({
        ...cat,
        services: cat.services.map(service => {
          const serviceId = generateDeterministicServiceId(section.id, cat.title, service.name);
          const overridePrice = this.livePriceById[serviceId] || this.livePriceByName[service.name];
          if (overridePrice) {
            return {
              ...service,
              price: overridePrice
            };
          }
          return service;
        })
      }))
    }));

    return {
      ...baseContent,
      prices: {
        ...baseContent.prices,
        sections: updatedSections
      }
    };
  }

  // Returns all services with deterministic real IDs
  public getAllServicesFlat(lang: Language = 'lv'): Array<{
    id: string;
    categoryTitle: string;
    sectionId: string;
    name: string;
    price: string;
    originalPrice: string;
  }> {
    const content = contentData[lang] || contentData['lv'];
    const list: Array<{
      id: string;
      categoryTitle: string;
      sectionId: string;
      name: string;
      price: string;
      originalPrice: string;
    }> = [];

    content.prices.sections.forEach(sec => {
      sec.categories.forEach(cat => {
        cat.services.forEach(srv => {
          const realId = generateDeterministicServiceId(sec.id, cat.title, srv.name);
          const currentPrice = this.livePriceById[realId] || this.livePriceByName[srv.name] || srv.price;
          list.push({
            id: realId,
            categoryTitle: `${sec.sectionTitle} - ${cat.title}`,
            sectionId: sec.id,
            name: srv.name,
            price: currentPrice,
            originalPrice: srv.price
          });
        });
      });
    });

    return list;
  }

  // Download real server-side D1 database backup
  public async downloadServerD1Backup(): Promise<{ ok: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch('/api/admin/backup', {
        headers: { Accept: 'application/json' },
        cache: 'no-cache'
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return {
          ok: false,
          error: errJson.error || errJson.message || `Servera kļūda HTTP ${res.status}`
        };
      }

      const data = await res.json();
      return { ok: true, data };
    } catch (e: any) {
      return {
        ok: false,
        error: `Tīkla kļūda ielādējot D1 rezerves kopiju: ${e.message}`
      };
    }
  }

  // Export full JSON backup of salon catalog (v1.13)
  public exportBackupJson(): string {
    return JSON.stringify({
      version: '1.13',
      exportDate: new Date().toISOString(),
      salon: 'Salons Aneri',
      address: 'Latgales iela 264, Rīga',
      phone: '+371 27580047',
      isD1Connected: this.isD1Connected,
      livePriceCount: Object.keys(this.livePriceById).length,
      livePrices: this.livePriceById,
      catalog: contentData
    }, null, 2);
  }
}

export const dataService = new DataService();
