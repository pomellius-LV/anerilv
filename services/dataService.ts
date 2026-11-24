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

export interface UpdateServicePayload {
  id: string;
  price?: string;
  name_lv?: string;
  name_ru?: string;
  name_en?: string;
  subcategory_lv?: string;
  subcategory_ru?: string;
  subcategory_en?: string;
  is_active?: number;
  order_num?: number;
}

export interface CreateServicePayload {
  category_id: string;
  subcategory_title: string;
  subcategory_lv?: string;
  subcategory_ru?: string;
  subcategory_en?: string;
  price: string;
  name_lv?: string;
  name_ru?: string;
  name_en?: string;
  order_num?: number;
}

export type SeasonType = 'winter' | 'spring' | 'summer' | 'autumn';
export type SeasonMode = 'auto' | SeasonType;

export function getCalendarSeason(date: Date = new Date()): SeasonType {
  const month = date.getMonth() + 1; // 1..12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function resolveActiveSeason(mode?: SeasonMode, date: Date = new Date()): SeasonType {
  if (mode === 'winter' || mode === 'spring' || mode === 'summer' || mode === 'autumn') {
    return mode;
  }
  return getCalendarSeason(date);
}

export interface SnowConfig {
  enabled: boolean;
  seasonMode: SeasonMode;
  size: number;
  color: string;
  count: number;
}

export const DEFAULT_SNOW_CONFIG: SnowConfig = {
  enabled: true,
  seasonMode: 'auto',
  size: 34,
  color: '#FFFFFF',
  count: 55
};

export interface GoogleProfileConfig {
  rating: string;
  reviewsCount: string;
  mapsUrl: string;
}

export const DEFAULT_GOOGLE_PROFILE: GoogleProfileConfig = {
  rating: '',
  reviewsCount: '',
  mapsUrl:
    "https://www.google.com/maps/place/56%C2%B054'30.6%22N+24%C2%B010'56.3%22E/@56.9085003,24.1822941,17z/"
};

export interface TaxonomyCategory {
  key: string;
  titles: Record<Language, string>;
}

export interface TaxonomySection {
  id: string;
  titles: Record<Language, string>;
  categories: TaxonomyCategory[];
}

export const CATALOG_TAXONOMY: TaxonomySection[] = [
  {
    id: 'hair',
    titles: {
      lv: '1. Frizētavas pakalpojumi',
      ru: '1. Парикмахерские услуги',
      en: '1. Hairdressing Services'
    },
    categories: [
      { key: 'Dāmām', titles: { lv: 'Dāmām', ru: 'Дамам', en: 'Ladies' } },
      { key: 'Kungiem', titles: { lv: 'Kungiem', ru: 'Мужчинам', en: 'Gentlemen' } },
      {
        key: 'Pensionāriem (no 65 gadiem)',
        titles: { lv: 'Pensionāriem (no 65 gadiem)', ru: 'Пенсионерам (от 65 лет)', en: 'Pensioners (65+)' }
      },
      { key: 'Bērniem', titles: { lv: 'Bērniem', ru: 'Детям', en: 'Kids' } }
    ]
  },
  {
    id: 'nails',
    titles: {
      lv: '2. Manikīrs un Pedikīrs',
      ru: '2. Маникюр и Педикюр',
      en: '2. Manicure & Pedicure'
    },
    categories: [
      { key: 'Manikīrs', titles: { lv: 'Manikīrs', ru: 'Маникюр', en: 'Manicure' } },
      { key: 'Pedikīrs', titles: { lv: 'Pedikīrs', ru: 'Педикюр', en: 'Pedicure' } }
    ]
  },
  {
    id: 'cosmetology',
    titles: {
      lv: '3. Kosmetoloģija un Pīlingi',
      ru: '3. Косметология и Пилинги',
      en: '3. Cosmetology & Peels'
    },
    categories: [
      {
        key: 'Kosmētiskās procedūras',
        titles: { lv: 'Kosmētiskās procedūras', ru: 'Косметические процедуры', en: 'Cosmetic Procedures' }
      },
      { key: 'Pīlingi', titles: { lv: 'Pīlingi', ru: 'Пилинги', en: 'Peels' } }
    ]
  },
  {
    id: 'permanent',
    titles: {
      lv: '4. Permanentais grims',
      ru: '4. Перманентный макияж',
      en: '4. Permanent Makeup'
    },
    categories: [
      { key: 'Procedūras', titles: { lv: 'Procedūras', ru: 'Процедуры', en: 'Procedures' } }
    ]
  },
  {
    id: 'waxing',
    titles: {
      lv: '5. Vaksācija',
      ru: '5. Ваксация (Депиляция)',
      en: '5. Waxing'
    },
    categories: [
      { key: 'Zonas', titles: { lv: 'Zonas', ru: 'Зоны', en: 'Zones' } }
    ]
  },
  {
    id: 'solarium',
    titles: {
      lv: '6. Solārijs',
      ru: '6. Солярий',
      en: '6. Solarium'
    },
    categories: [
      {
        key: 'Apmeklējums / Abonements',
        titles: { lv: 'Apmeklējums / Abonements', ru: 'Посещение / Абонемент', en: 'Visit / Subscription' }
      }
    ]
  }
];

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
  private livePriceById: Record<string, string> = {};
  private livePriceByName: Record<string, string> = {};
  private liveServicesByLang: Partial<Record<Language, Array<{
    id: string;
    category_id: string;
    subcategory_title: string;
    subcategory_localized?: string;
    order_num?: number;
    name: string;
    price: string;
  }>>> = {};

  public isD1Connected = false;
  public isUsingFallback = true;
  public lastSyncTime: Date | null = null;
  public d1Error: string | null = null;
  public snowConfig: SnowConfig = { ...DEFAULT_SNOW_CONFIG };
  public googleProfile: GoogleProfileConfig = { ...DEFAULT_GOOGLE_PROFILE };

  public getSnowEnabled(): boolean {
    return this.snowConfig.enabled;
  }

  public getSnowConfig(): SnowConfig {
    return this.snowConfig;
  }

  public getGoogleProfile(): GoogleProfileConfig {
    return this.googleProfile;
  }

  private applySettingsMap(settings: Record<string, string>) {
    const next: SnowConfig = { ...this.snowConfig };
    const nextGoogle: GoogleProfileConfig = { ...this.googleProfile };

    if (settings.snow_enabled !== undefined) {
      next.enabled = settings.snow_enabled !== '0' && settings.snow_enabled !== 'false';
    }
    if (settings.season_mode !== undefined) {
      const m = settings.season_mode.trim().toLowerCase();
      if (m === 'auto' || m === 'winter' || m === 'spring' || m === 'summer' || m === 'autumn') {
        next.seasonMode = m;
      }
    }
    if (settings.snow_size !== undefined) {
      const parsedSize = Number(settings.snow_size);
      if (Number.isFinite(parsedSize)) {
        next.size = Math.min(60, Math.max(14, Math.round(parsedSize)));
      }
    }
    if (settings.snow_count !== undefined) {
      const parsedCount = Number(settings.snow_count);
      if (Number.isFinite(parsedCount)) {
        next.count = Math.min(120, Math.max(8, Math.round(parsedCount)));
      }
    }
    if (settings.snow_color !== undefined && /^#[0-9a-fA-F]{6}$/.test(settings.snow_color.trim())) {
      next.color = settings.snow_color.trim().toUpperCase();
    }

    if (settings.google_rating !== undefined) {
      const cleaned = settings.google_rating.trim().replace(',', '.');
      if (cleaned === '' || (/^\d(\.\d{1,2})?$/.test(cleaned) && Number(cleaned) >= 1 && Number(cleaned) <= 5)) {
        nextGoogle.rating = cleaned;
      }
    }
    if (settings.google_reviews_count !== undefined) {
      const cleanedCount = settings.google_reviews_count.trim().replace(/[^\d]/g, '');
      nextGoogle.reviewsCount = cleanedCount;
    }
    if (settings.google_maps_url !== undefined) {
      const trimmedUrl = settings.google_maps_url.trim();
      if (trimmedUrl.startsWith('https://')) {
        nextGoogle.mapsUrl = trimmedUrl;
      } else if (trimmedUrl === '') {
        nextGoogle.mapsUrl = DEFAULT_GOOGLE_PROFILE.mapsUrl;
      }
    }

    this.snowConfig = next;
    this.googleProfile = nextGoogle;
    this.notify();
  }

  public async fetchPublicSettings(): Promise<Record<string, string>> {
    try {
      const res = await fetch('/api/public/settings', {
        headers: { Accept: 'application/json' },
        cache: 'no-cache'
      });
      if (!res.ok) return {};
      const data = await res.json();
      const settings: Record<string, string> = data?.settings || {};
      this.applySettingsMap(settings);
      return settings;
    } catch {
      return {};
    }
  }

  public async fetchAdminSettings(): Promise<{
    ok: boolean;
    settings: Record<string, string>;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Accept: 'application/json' },
        cache: 'no-cache'
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return {
          ok: false,
          settings: {
            season_mode: this.snowConfig.seasonMode,
            snow_enabled: this.snowConfig.enabled ? '1' : '0',
            snow_size: String(this.snowConfig.size),
            snow_color: this.snowConfig.color,
            snow_count: String(this.snowConfig.count)
          },
          error: err.error || err.message || `HTTP ${res.status}`
        };
      }
      const data = await res.json();
      const settings: Record<string, string> = data?.settings || {};
      this.applySettingsMap(settings);
      return { ok: true, settings };
    } catch (e: any) {
      return {
        ok: false,
        settings: {
          season_mode: this.snowConfig.seasonMode,
          snow_enabled: this.snowConfig.enabled ? '1' : '0',
          snow_size: String(this.snowConfig.size),
          snow_color: this.snowConfig.color,
          snow_count: String(this.snowConfig.count)
        },
        error: e?.message || 'Savienojuma kļūda'
      };
    }
  }

  public async updateAdminSettings(
    updates: Record<string, string>
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        return {
          ok: false,
          error: data.error || data.message || `Kļūda ${res.status}`
        };
      }
      this.applySettingsMap(updates);
      return { ok: true };
    } catch (e: any) {
      return {
        ok: false,
        error: e?.message || 'Tīkla kļūda saglabājot iestatījumu'
      };
    }
  }

  public async updateAdminSetting(
    key: string,
    value: string
  ): Promise<{ ok: boolean; error?: string }> {
    return this.updateAdminSettings({ [key]: value });
  }

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

        this.liveServicesByLang[lang] = data.services;

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

  // Full service update (price, localized names, visibility)
  public async updateService(payload: UpdateServicePayload): Promise<{
    ok: boolean;
    id?: string;
    price?: string;
    service?: AdminServiceItem | null;
    error?: string;
    message?: string;
  }> {
    if (!payload.id || payload.id.trim() === '') {
      return { ok: false, error: 'Pakalpojuma ID trūkst. Saglabāšana apturēta.' };
    }
    if (payload.price !== undefined && payload.price.trim() === '') {
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
          ...payload,
          id: payload.id.trim(),
          price: payload.price !== undefined ? payload.price.trim() : undefined
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        return {
          ok: false,
          error: data.error || data.message || `Kļūda ${res.status}: Neizdevās saglabāt izmaiņas D1 datubāzē.`
        };
      }

      if (data.price) {
        this.livePriceById[payload.id.trim()] = data.price;
      }
      if (payload.name_lv && data.price) {
        this.livePriceByName[payload.name_lv] = data.price;
      }
      // Clear cached public lists so next render pulls fresh D1 data
      this.liveServicesByLang = {};
      this.notify();

      return {
        ok: true,
        id: payload.id.trim(),
        price: data.price,
        service: data.service || null,
        message: data.message || 'Izmaiņas veiksmīgi saglabātas Cloudflare D1 datubāzē.'
      };
    } catch (e: any) {
      return {
        ok: false,
        error: `Tīkla kļūda: ${e.message}. Izmaiņas netika saglabātas D1 datubāzē.`
      };
    }
  }

  // Backwards-compatible wrapper for price updates
  public async updatePrice(
    serviceId: string,
    newPrice: string,
    nameLv?: string
  ): Promise<{ ok: boolean; id?: string; price?: string; error?: string; message?: string }> {
    return this.updateService({
      id: serviceId,
      price: newPrice,
      name_lv: nameLv
    });
  }

  // Create a brand new service in D1
  public async createService(payload: CreateServicePayload): Promise<{
    ok: boolean;
    id?: string;
    service?: AdminServiceItem | null;
    error?: string;
    message?: string;
  }> {
    if (!payload.category_id || !payload.price?.trim()) {
      return { ok: false, error: 'Kategorija un cena ir obligātas.' };
    }
    const primary = payload.name_lv?.trim() || payload.name_ru?.trim() || payload.name_en?.trim();
    if (!primary) {
      return { ok: false, error: 'Pakalpojuma nosaukums ir obligāts.' };
    }

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        return {
          ok: false,
          error: data.error || data.message || `Kļūda ${res.status}: Neizdevās pievienot pakalpojumu.`
        };
      }

      if (data.id && payload.price) {
        this.livePriceById[data.id] = payload.price.trim();
      }
      this.liveServicesByLang = {};
      this.notify();

      return {
        ok: true,
        id: data.id,
        service: data.service || null,
        message: data.message || 'Jauns pakalpojums pievienots D1 datubāzei.'
      };
    } catch (e: any) {
      return {
        ok: false,
        error: `Tīkla kļūda: ${e.message}`
      };
    }
  }

  // Delete service from D1
  public async deleteService(serviceId: string): Promise<{
    ok: boolean;
    deleted?: string;
    error?: string;
    message?: string;
  }> {
    if (!serviceId || !serviceId.trim()) {
      return { ok: false, error: 'Trūkst pakalpojuma ID.' };
    }

    try {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(serviceId.trim())}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        return {
          ok: false,
          error: data.error || data.message || `Kļūda ${res.status}: Neizdevās dzēst pakalpojumu.`
        };
      }

      delete this.livePriceById[serviceId.trim()];
      this.liveServicesByLang = {};
      this.notify();

      return {
        ok: true,
        deleted: data.deleted || serviceId.trim(),
        message: data.message || 'Pakalpojums dzēsts no Cloudflare D1 datubāzes.'
      };
    } catch (e: any) {
      return {
        ok: false,
        error: `Tīkla kļūda: ${e.message}`
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

  // Merges bundled contentData with live D1 prices, renames, additions, and deletions
  public getMergedContent(lang: Language): Content {
    const baseContent = contentData[lang];
    if (!baseContent) return contentData['lv'];

    const liveForLang = this.liveServicesByLang[lang];
    const hasLiveD1 = !!(this.isD1Connected && liveForLang && liveForLang.length > 0);
    const liveByIdMap = new Map((liveForLang || []).map(s => [s.id, s]));

    const lvSections = contentData.lv.prices.sections;

    // Build set of static LV service IDs so EN preserves its curated layout while still showing newly added D1 items
    const staticLvIds = new Set<string>();
    lvSections.forEach(sec => {
      sec.categories.forEach(cat => {
        cat.services.forEach(srv => {
          staticLvIds.add(generateDeterministicServiceId(sec.id, cat.title, srv.name));
        });
      });
    });

    const updatedSections: PriceSection[] = baseContent.prices.sections.map((section, sIdx) => {
      const lvSection = lvSections.find(s => s.id === section.id) || lvSections[sIdx];

      return {
        ...section,
        categories: section.categories.map((cat, cIdx) => {
          const lvCat = lvSection?.categories[cIdx];
          const lvCatTitle = lvCat?.title || cat.title;

          const matchedD1Ids = new Set<string>();
          const updatedServices: Array<{ name: string; price: string }> = [];

          cat.services.forEach((service, srvIdx) => {
            // For LV and RU, rows align 1:1 with LV canonical IDs
            const lvSrv = (lang === 'lv' || lang === 'ru') ? lvCat?.services[srvIdx] : undefined;
            const canonicalId = lvSrv
              ? generateDeterministicServiceId(section.id, lvCatTitle, lvSrv.name)
              : generateDeterministicServiceId(section.id, cat.title, service.name);

            const liveById = liveByIdMap.get(canonicalId);

            if (hasLiveD1 && (lang === 'lv' || lang === 'ru')) {
              if (!liveById) {
                // Service was deleted or hidden (is_active = 0) in D1
                return;
              }
              matchedD1Ids.add(liveById.id);
              updatedServices.push({
                name: liveById.name || service.name,
                price: liveById.price || service.price
              });
              return;
            }

            if (liveById) {
              matchedD1Ids.add(liveById.id);
              updatedServices.push({
                name: liveById.name || service.name,
                price: liveById.price || service.price
              });
              return;
            }

            const overridePrice = this.livePriceById[canonicalId] || this.livePriceByName[service.name];
            updatedServices.push({
              ...service,
              price: overridePrice || service.price
            });
          });

          // Append any new D1 services belonging to this category
          if (liveForLang && liveForLang.length > 0) {
            const existingNames = new Set(updatedServices.map(s => s.name.trim().toLowerCase()));

            const matchingD1 = liveForLang.filter(srv => {
              if (srv.category_id !== section.id) return false;
              const subMatch =
                srv.subcategory_title?.trim().toLowerCase() === lvCatTitle.trim().toLowerCase() ||
                srv.subcategory_title?.trim().toLowerCase() === cat.title.trim().toLowerCase() ||
                srv.subcategory_localized?.trim().toLowerCase() === cat.title.trim().toLowerCase();
              if (!subMatch) return false;
              if (matchedD1Ids.has(srv.id) || existingNames.has(srv.name.trim().toLowerCase())) {
                return false;
              }
              if (lang === 'en' && staticLvIds.has(srv.id)) {
                return false;
              }
              return true;
            });

            matchingD1.forEach(srv => {
              updatedServices.push({
                name: srv.name,
                price: srv.price
              });
            });
          }

          return {
            ...cat,
            services: updatedServices
          };
        })
      };
    });

    return {
      ...baseContent,
      prices: {
        ...baseContent.prices,
        sections: updatedSections
      }
    };
  }

  // Returns all services across LV/RU/EN for offline fallback in AdminPanel
  public getFallbackAdminCatalog(): AdminServiceItem[] {
    const lvSections = contentData.lv.prices.sections;
    const ruSections = contentData.ru.prices.sections;
    const enSections = contentData.en.prices.sections;

    const list: AdminServiceItem[] = [];
    let orderCounter = 1;

    lvSections.forEach((sec, sIdx) => {
      const ruSec = ruSections[sIdx];
      const enSec = enSections[sIdx];

      sec.categories.forEach((cat, cIdx) => {
        const ruCat = ruSec?.categories[cIdx];
        const enCat = enSec?.categories[cIdx];

        cat.services.forEach((srv, iIdx) => {
          const realId = generateDeterministicServiceId(sec.id, cat.title, srv.name);
          const currentPrice = this.livePriceById[realId] || this.livePriceByName[srv.name] || srv.price;
          const ruSrv = ruCat?.services[iIdx];
          const enSrv = enCat?.services[iIdx];

          list.push({
            id: realId,
            category_id: sec.id,
            subcategory_title: cat.title,
            subcategory_lv: cat.title,
            subcategory_ru: ruCat?.title || cat.title,
            subcategory_en: enCat?.title || cat.title,
            order_num: orderCounter++,
            price: currentPrice,
            is_active: 1,
            name: srv.name,
            name_lv: srv.name,
            name_ru: ruSrv?.name || srv.name,
            name_en: enSrv?.name || srv.name
          });
        });
      });
    });

    return list;
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

  // Export full JSON backup of salon catalog (v2.20)
  public exportBackupJson(): string {
    return JSON.stringify({
      version: '2.20',
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
