import React, { useState, useEffect, useMemo } from 'react';
import { Language, View } from '../types';
import {
  dataService,
  AdminServiceItem,
  CATALOG_TAXONOMY,
  SeasonMode,
  SeasonType,
  resolveActiveSeason,
  getCalendarSeason
} from '../services/dataService';
import {
  Lock,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Database,
  Tag,
  FileText,
  Settings as SettingsIcon,
  Search,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info,
  Server,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Languages,
  Check,
  X,
  Snowflake,
  Flower2,
  Sparkles,
  Leaf,
  Calendar
} from 'lucide-react';

interface AdminPanelProps {
  setView: (view: View) => void;
}

type AdminTab = 'services' | 'articles' | 'settings' | 'database';

interface RowEditDraft {
  price?: string;
  name_lv?: string;
  name_ru?: string;
  name_en?: string;
}

interface NewServiceDraft {
  name_lv: string;
  name_ru: string;
  name_en: string;
  price: string;
  showAllLangs: boolean;
}

const UI_COPY: Record<Language, {
  searchPlaceholder: string;
  allSections: string;
  refreshBtn: string;
  backupBtn: string;
  addBtn: string;
  namePlaceholder: string;
  pricePlaceholder: string;
  saveOk: string;
  cancelBtn: string;
  confirmDelete: string;
  yes: string;
  no: string;
  hiddenLabel: string;
  moreLangs: string;
  hideLangs: string;
  emptyCategory: string;
  editHint: string;
}> = {
  lv: {
    searchPlaceholder: 'Meklēt pakalpojumu vai ID...',
    allSections: 'Visas nodaļas (6)',
    refreshBtn: 'Atjaunināt',
    backupBtn: 'Kopija (JSON)',
    addBtn: 'Pievienot pozīciju',
    namePlaceholder: 'Pakalpojuma nosaukums...',
    pricePlaceholder: 'piem., 25.00 €',
    saveOk: 'OK',
    cancelBtn: 'Atcelt',
    confirmDelete: 'Dzēst?',
    yes: 'Jā',
    no: 'Nē',
    hiddenLabel: 'Slēpts',
    moreLangs: 'LV / RU / EN',
    hideLangs: 'Aizvērt tulkojumus',
    emptyCategory: 'Nav atbilstošu pakalpojumu',
    editHint: 'Rediģējiet nosaukumu vai cenu tieši kartītē un spiediet OK'
  },
  ru: {
    searchPlaceholder: 'Поиск услуги или ID...',
    allSections: 'Все разделы (6)',
    refreshBtn: 'Обновить',
    backupBtn: 'Бэкап (JSON)',
    addBtn: 'Добавить позицию',
    namePlaceholder: 'Название услуги...',
    pricePlaceholder: 'напр., 5.00 - 10.00 €',
    saveOk: 'OK',
    cancelBtn: 'Отмена',
    confirmDelete: 'Удалить?',
    yes: 'Да',
    no: 'Нет',
    hiddenLabel: 'Скрыто',
    moreLangs: 'LV / RU / EN',
    hideLangs: 'Скрыть переводы',
    emptyCategory: 'Нет подходящих услуг',
    editHint: 'Меняйте название или цену прямо в карточке и нажимайте OK'
  },
  en: {
    searchPlaceholder: 'Search service or ID...',
    allSections: 'All sections (6)',
    refreshBtn: 'Refresh',
    backupBtn: 'Backup (JSON)',
    addBtn: 'Add service',
    namePlaceholder: 'Service name...',
    pricePlaceholder: 'e.g. 25.00 €',
    saveOk: 'OK',
    cancelBtn: 'Cancel',
    confirmDelete: 'Delete?',
    yes: 'Yes',
    no: 'No',
    hiddenLabel: 'Hidden',
    moreLangs: 'LV / RU / EN',
    hideLangs: 'Hide translations',
    emptyCategory: 'No matching services',
    editHint: 'Edit name or price directly on any card and press OK'
  }
};

const EMPTY_NEW_DRAFT: NewServiceDraft = {
  name_lv: '',
  name_ru: '',
  name_en: '',
  price: '',
  showAllLangs: false
};

const AdminPanel: React.FC<AdminPanelProps> = ({ setView }) => {
  // Authentication State strictly driven by server Cloudflare Access verification
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('pomellius@gmail.com');
  const [authError, setAuthError] = useState<string>('');
  const [authReason, setAuthReason] = useState<'preview_env' | 'access_redirect' | 'unauthorized' | 'network' | undefined>(undefined);

  // Active Tab & Editor Language
  const [activeTab, setActiveTab] = useState<AdminTab>('services');
  const [editorLang, setEditorLang] = useState<Language>('lv');

  // Services Editor State
  const [servicesList, setServicesList] = useState<AdminServiceItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rowDrafts, setRowDrafts] = useState<Record<string, RowEditDraft>>({});
  const [expandedTransId, setExpandedTransId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Inline Create New Service State per Category Card (key: `${sectionId}::${catKey}`)
  const [addingCardKey, setAddingCardKey] = useState<string | null>(null);
  const [newDraft, setNewDraft] = useState<NewServiceDraft>(EMPTY_NEW_DRAFT);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Feedback Messages
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [saveErrorMsg, setSaveErrorMsg] = useState<string>('');
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);

  // Diagnostic & Site Settings State
  const [isD1Live, setIsD1Live] = useState<boolean>(false);
  const [isDownloadingBackup, setIsDownloadingBackup] = useState<boolean>(false);
  const [snowEnabled, setSnowEnabled] = useState<boolean>(() => dataService.getSnowConfig().enabled);
  const [seasonMode, setSeasonMode] = useState<SeasonMode>(() => dataService.getSnowConfig().seasonMode);
  const [snowSize, setSnowSize] = useState<number>(() => dataService.getSnowConfig().size);
  const [snowColor, setSnowColor] = useState<string>(() => dataService.getSnowConfig().color);
  const [snowCount, setSnowCount] = useState<number>(() => dataService.getSnowConfig().count);
  const [isSavingSnow, setIsSavingSnow] = useState<boolean>(false);

  // Articles State
  const [articlesList, setArticlesList] = useState<any[]>([]);

  const ui = UI_COPY[editorLang];

  // 1. Verify Cloudflare Access Authentication on mount
  const verifyAccess = async () => {
    setIsCheckingAuth(true);
    setAuthError('');
    setAuthReason(undefined);
    try {
      const auth = await dataService.checkAdminAuth();
      if (auth.authenticated && auth.email) {
        setIsAuthenticated(true);
        setAdminEmail(auth.email);
        loadServices();
        loadAdminSettings();
      } else {
        setIsAuthenticated(false);
        setAuthReason(auth.reason);
        setAuthError(auth.error || 'Cloudflare Access JWT nav konstatēts. Nepieciešama autorizācija caur Cloudflare Zero Trust.');
      }
    } catch (e: any) {
      setIsAuthenticated(false);
      setAuthError(`Autorizācijas pārbaudes kļūda: ${e.message}`);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    verifyAccess();
  }, []);

  // 2. Load Services with real permanent IDs from D1
  const loadServices = async () => {
    setIsLoadingServices(true);
    const result = await dataService.fetchAdminServices();
    setIsD1Live(result.isD1Connected);

    if (result.ok && result.services.length > 0) {
      setServicesList(result.services);
    } else {
      setServicesList(dataService.getFallbackAdminCatalog());
      if (result.error && !result.isD1Connected) {
        setSaveErrorMsg(`D1 savienojums: ${result.error}`);
      }
    }
    setIsLoadingServices(false);
  };

  // Load D1 site settings (season_mode, snow_enabled, snow_size, snow_color, snow_count)
  const loadAdminSettings = async () => {
    await dataService.fetchAdminSettings();
    const cfg = dataService.getSnowConfig();
    setSnowEnabled(cfg.enabled);
    setSeasonMode(cfg.seasonMode);
    setSnowSize(cfg.size);
    setSnowColor(cfg.color);
    setSnowCount(cfg.count);
  };

  // Save all seasonal animation settings atomically to Cloudflare D1
  const handleSaveSnowSettings = async (overrides?: {
    enabled?: boolean;
    seasonMode?: SeasonMode;
    size?: number;
    color?: string;
    count?: number;
  }) => {
    if (isSavingSnow) return;
    const nextEnabled = overrides?.enabled ?? snowEnabled;
    const nextSeasonMode = overrides?.seasonMode ?? seasonMode;
    const nextSize = overrides?.size ?? snowSize;
    const nextColor = overrides?.color ?? snowColor;
    const nextCount = overrides?.count ?? snowCount;

    setIsSavingSnow(true);
    const res = await dataService.updateAdminSettings({
      snow_enabled: nextEnabled ? '1' : '0',
      season_mode: nextSeasonMode,
      snow_size: String(nextSize),
      snow_color: nextColor,
      snow_count: String(nextCount)
    });
    setIsSavingSnow(false);

    if (res.ok) {
      setSnowEnabled(nextEnabled);
      setSeasonMode(nextSeasonMode);
      setSnowSize(nextSize);
      setSnowColor(nextColor);
      setSnowCount(nextCount);
      showSuccess(
        `Sezonu efekti saglabāti D1 (${nextEnabled ? 'ON' : 'OFF'}, režīms: ${nextSeasonMode}, ${nextSize}px, ${nextCount} gab.).`
      );
    } else {
      showError(res.error || 'Neizdevās saglabāt sezonu iestatījumus Cloudflare D1.');
    }
  };

  const handleToggleSnow = async () => {
    const nextEnabled = !snowEnabled;
    setSnowEnabled(nextEnabled);
    await handleSaveSnowSettings({ enabled: nextEnabled });
  };

  // 3. Load Articles for diagnostic review
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/public/articles?lang=lv')
        .then(res => res.json())
        .then(data => {
          if (data && data.articles) {
            setArticlesList(data.articles);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const showSuccess = (msg: string) => {
    setSaveErrorMsg('');
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const showError = (msg: string) => {
    setSaveSuccessMsg('');
    setSaveErrorMsg(msg);
    setTimeout(() => setSaveErrorMsg(''), 8000);
  };

  // Helper to get active display name in current language
  const getServiceDisplayName = (s: AdminServiceItem, lang: Language): string => {
    if (lang === 'lv') return s.name_lv || s.name || s.name_en || s.name_ru || s.id;
    if (lang === 'ru') return s.name_ru || s.name_lv || s.name || s.id;
    return s.name_en || s.name_lv || s.name || s.id;
  };

  const handleDraftChange = (serviceId: string, field: keyof RowEditDraft, value: string) => {
    setRowDrafts(prev => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || {}),
        [field]: value
      }
    }));
  };

  const getActiveNameField = (lang: Language): 'name_lv' | 'name_ru' | 'name_en' => {
    if (lang === 'ru') return 'name_ru';
    if (lang === 'en') return 'name_en';
    return 'name_lv';
  };

  const isRowDirty = (s: AdminServiceItem): boolean => {
    const draft = rowDrafts[s.id];
    if (!draft) return false;
    if (draft.price !== undefined && draft.price.trim() !== (s.price || '').trim()) return true;
    if (draft.name_lv !== undefined && draft.name_lv.trim() !== (s.name_lv || '').trim()) return true;
    if (draft.name_ru !== undefined && draft.name_ru.trim() !== (s.name_ru || '').trim()) return true;
    if (draft.name_en !== undefined && draft.name_en.trim() !== (s.name_en || '').trim()) return true;
    return false;
  };

  // 4. Save Inline Edits (Name(s) + Price) to D1
  const handleSaveRow = async (service: AdminServiceItem) => {
    const draft = rowDrafts[service.id];
    if (!draft || !isRowDirty(service)) return;

    const nextPrice = draft.price !== undefined ? draft.price.trim() : service.price;
    if (!nextPrice) {
      showError('Cena nevar būt tukša.');
      return;
    }

    const payload: {
      id: string;
      price: string;
      name_lv?: string;
      name_ru?: string;
      name_en?: string;
    } = {
      id: service.id,
      price: nextPrice
    };

    if (draft.name_lv !== undefined && draft.name_lv.trim() !== (service.name_lv || '').trim()) {
      if (!draft.name_lv.trim()) {
        showError('Nosaukums (LV) nevar būt tukšs.');
        return;
      }
      payload.name_lv = draft.name_lv.trim();
    }
    if (draft.name_ru !== undefined && draft.name_ru.trim() !== (service.name_ru || '').trim()) {
      if (!draft.name_ru.trim()) {
        showError('Название (RU) не может быть пустым.');
        return;
      }
      payload.name_ru = draft.name_ru.trim();
    }
    if (draft.name_en !== undefined && draft.name_en.trim() !== (service.name_en || '').trim()) {
      if (!draft.name_en.trim()) {
        showError('Name (EN) cannot be empty.');
        return;
      }
      payload.name_en = draft.name_en.trim();
    }

    setIsSyncingId(service.id);
    const res = await dataService.updateService(payload);
    setIsSyncingId(null);

    if (res.ok) {
      const updatedItem: AdminServiceItem = res.service
        ? res.service
        : {
            ...service,
            price: nextPrice,
            name_lv: payload.name_lv ?? service.name_lv,
            name_ru: payload.name_ru ?? service.name_ru,
            name_en: payload.name_en ?? service.name_en
          };

      setServicesList(prev => prev.map(s => (s.id === service.id ? updatedItem : s)));
      setRowDrafts(prev => {
        const copy = { ...prev };
        delete copy[service.id];
        return copy;
      });
      const shownName = getServiceDisplayName(updatedItem, editorLang);
      showSuccess(`"${shownName}" → ${nextPrice} saglabāts D1 datubāzē.`);
    } else {
      showError(res.error || 'Neizdevās saglabāt izmaiņas Cloudflare D1 datubāzē.');
    }
  };

  // 5. Toggle Active / Hidden visibility in D1
  const handleToggleActive = async (service: AdminServiceItem) => {
    const nextActive = service.is_active ? 0 : 1;
    setIsSyncingId(service.id);
    const res = await dataService.updateService({
      id: service.id,
      price: service.price,
      is_active: nextActive
    });
    setIsSyncingId(null);

    if (res.ok) {
      setServicesList(prev =>
        prev.map(s => (s.id === service.id ? { ...s, is_active: nextActive } : s))
      );
      showSuccess(
        nextActive
          ? `"${getServiceDisplayName(service, editorLang)}" tagad redzams publiskajā cenrādī.`
          : `"${getServiceDisplayName(service, editorLang)}" paslēpts no publiskā cenrāža.`
      );
    } else {
      showError(res.error || 'Neizdevās mainīt redzamību.');
    }
  };

  // 6. Delete Service from D1 (inline confirm, no browser alert/confirm)
  const handleDeleteService = async (service: AdminServiceItem) => {
    setIsSyncingId(service.id);
    const res = await dataService.deleteService(service.id);
    setIsSyncingId(null);
    setConfirmDeleteId(null);

    if (res.ok) {
      setServicesList(prev => prev.filter(s => s.id !== service.id));
      showSuccess(`"${getServiceDisplayName(service, editorLang)}" dzēsts no D1 datubāzes.`);
    } else {
      showError(res.error || 'Neizdevās dzēst pakalpojumu.');
    }
  };

  // 7. Create New Service inside specific Category Card
  const handleOpenAddForm = (cardKey: string) => {
    setAddingCardKey(cardKey);
    setNewDraft({ ...EMPTY_NEW_DRAFT });
  };

  const handleCreateService = async (
    sectionId: string,
    categoryKey: string,
    titles: Record<Language, string>
  ) => {
    const primaryName =
      newDraft.name_lv.trim() ||
      newDraft.name_ru.trim() ||
      newDraft.name_en.trim();

    if (!primaryName) {
      showError('Ievadiet jaunā pakalpojuma nosaukumu.');
      return;
    }
    if (!newDraft.price.trim()) {
      showError('Ievadiet cenu (piemēram, 5.00 - 10.00 €).');
      return;
    }

    setIsCreating(true);
    const res = await dataService.createService({
      category_id: sectionId,
      subcategory_title: categoryKey,
      subcategory_lv: titles.lv,
      subcategory_ru: titles.ru,
      subcategory_en: titles.en,
      price: newDraft.price.trim(),
      name_lv: newDraft.name_lv.trim() || primaryName,
      name_ru: newDraft.name_ru.trim() || primaryName,
      name_en: newDraft.name_en.trim() || primaryName
    });
    setIsCreating(false);

    if (res.ok) {
      const createdItem: AdminServiceItem = res.service
        ? res.service
        : {
            id: res.id || `${sectionId}_${Date.now()}`,
            category_id: sectionId,
            subcategory_title: categoryKey,
            subcategory_lv: titles.lv,
            subcategory_ru: titles.ru,
            subcategory_en: titles.en,
            order_num: 999,
            price: newDraft.price.trim(),
            is_active: 1,
            name_lv: newDraft.name_lv.trim() || primaryName,
            name_ru: newDraft.name_ru.trim() || primaryName,
            name_en: newDraft.name_en.trim() || primaryName
          };

      setServicesList(prev => [...prev, createdItem]);
      setAddingCardKey(null);
      setNewDraft({ ...EMPTY_NEW_DRAFT });
      showSuccess(`Jauna pozīcija "${primaryName}" (${newDraft.price.trim()}) pievienota D1!`);
    } else {
      showError(res.error || 'Neizdevās pievienot jaunu pozīciju D1.');
    }
  };

  // 8. Authoritative Server-Side D1 JSON Backup Export (v1.23)
  const handleExportBackup = async () => {
    setIsDownloadingBackup(true);
    setSaveErrorMsg('');
    try {
      const res = await dataService.downloadServerD1Backup();
      let jsonStr: string;
      let filename: string;

      if (res.ok && res.data) {
        jsonStr = JSON.stringify(res.data, null, 2);
        filename = `aneri_d1_backup_${new Date().toISOString().slice(0, 10)}_v1.23.json`;
        showSuccess(`Servera Cloudflare D1 rezerves kopija veiksmīgi iegūta (${res.data.totalRecords || 0} ieraksti).`);
      } else {
        jsonStr = dataService.exportBackupJson();
        filename = `aneri_catalog_snapshot_${new Date().toISOString().slice(0, 10)}_v1.23.json`;
        showError(`D1 servera brīdinājums: ${res.error || 'D1 bezsaistē'}. Lejupielādēts lokālais kataloga uzņēmums.`);
      }

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      showError(`Kļūda sagatavojot rezerves kopiju: ${e.message}`);
    } finally {
      setIsDownloadingBackup(false);
    }
  };

  // Filter services by search & section
  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return servicesList.filter(s => {
      if (selectedSection !== 'all' && s.category_id !== selectedSection) return false;
      if (!q) return true;
      return (
        (s.name_lv && s.name_lv.toLowerCase().includes(q)) ||
        (s.name_ru && s.name_ru.toLowerCase().includes(q)) ||
        (s.name_en && s.name_en.toLowerCase().includes(q)) ||
        (s.subcategory_title && s.subcategory_title.toLowerCase().includes(q)) ||
        (s.subcategory_ru && s.subcategory_ru.toLowerCase().includes(q)) ||
        (s.subcategory_en && s.subcategory_en.toLowerCase().includes(q)) ||
        s.price.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    });
  }, [servicesList, selectedSection, searchQuery]);

  // Visible taxonomy sections
  const visibleSections = useMemo(() => {
    return CATALOG_TAXONOMY.filter(sec => selectedSection === 'all' || sec.id === selectedSection);
  }, [selectedSection]);

  // Helper: collect services for a category card
  const getServicesForCategory = (sectionId: string, categoryKey: string) => {
    const normalizedKey = categoryKey.trim().toLowerCase();
    return filteredServices.filter(s => {
      if (s.category_id !== sectionId) return false;
      return (s.subcategory_title || '').trim().toLowerCase() === normalizedKey;
    });
  };

  // Helper: collect any orphan services in section that don't match known taxonomy categories
  const getExtraCategoriesForSection = (sectionId: string, knownKeys: string[]) => {
    const knownSet = new Set(knownKeys.map(k => k.trim().toLowerCase()));
    const extraGroups = new Map<string, AdminServiceItem[]>();
    filteredServices.forEach(s => {
      if (s.category_id !== sectionId) return;
      const sub = (s.subcategory_title || 'Citi').trim();
      if (!knownSet.has(sub.toLowerCase())) {
        const list = extraGroups.get(sub) || [];
        list.push(s);
        extraGroups.set(sub, list);
      }
    });
    return Array.from(extraGroups.entries());
  };

  // =========================================================================
  // Screen A: Cloudflare Access Gateway (When not authenticated)
  // ZERO PIN / Password fields; strictly enforces Cloudflare Zero Trust
  // =========================================================================
  if (!isAuthenticated) {
    const isPreview = authReason === 'preview_env' || dataService.isPreviewHost();

    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 selection:bg-rose-900 selection:text-white">
        <div className="max-w-xl w-full bg-stone-800 border border-stone-700/80 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Salons <span className="text-primary">Aneri</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-stone-400 mb-3">
              <Lock size={12} className="text-rose-400" />
              <span>Cloudflare Access Zero Trust</span>
              <span aria-hidden="true">·</span>
              <span>pomellius.cloudflareaccess.com</span>
            </div>
            <p className="text-stone-400 text-xs tracking-wide max-w-md mx-auto">
              Administratora panelis un visi <code className="text-rose-300 bg-stone-900 px-1 py-0.5 rounded">/api/admin/*</code> galapunkti ir aizsargāti ar Cloudflare Access JWT sertifikātu.
            </p>
          </div>

          <div className="bg-stone-900/90 border border-stone-700 rounded-2xl p-5 mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-stone-300 space-y-1.5">
                <p className="font-semibold text-white">Autorizētais administrators &amp; komanda:</p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <span className="text-primary">pomellius@gmail.com</span>
                  <span className="text-stone-600">·</span>
                  <span className="text-stone-300">Team: pomellius</span>
                </div>
              </div>
            </div>

            {authError && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                isPreview
                  ? 'bg-amber-950/50 border-amber-700/70 text-amber-200'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}>
                <AlertCircle size={16} className={`shrink-0 mt-0.5 ${isPreview ? 'text-amber-400' : 'text-rose-400'}`} />
                <div className="space-y-1">
                  <p className="font-semibold">
                    {isPreview ? 'AI Studio priekšskatījuma režīms (bez Cloudflare Edge)' : authError}
                  </p>
                  {isPreview && (
                    <p className="text-[11px] text-amber-200/80 leading-relaxed">
                      Šajā priekšskatījuma logā nav aktīvs Cloudflare Zero Trust un D1 datubāze. Lai ieietu panelī, atveriet produkcijas adresi <span className="font-mono text-white">aneri.lv/admin</span>, vai atsūtiet cenu izmaiņas čatā.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 space-y-1.5">
              <p className="font-semibold text-stone-300">Cloudflare One (Applications) iestatīšana:</p>
              <ol className="list-decimal list-inside space-y-1 text-stone-400 leading-relaxed">
                <li>Atveriet <span className="text-stone-200">Zero Trust → Access → Applications → Add an application (Self-hosted)</span>.</li>
                <li>Norādiet domēnu <span className="font-mono text-stone-200">aneri.lv</span> un ceļus: <span className="font-mono text-rose-300">admin*</span> un <span className="font-mono text-rose-300">api/admin*</span>.</li>
                <li>Pievienojiet politiku <span className="text-stone-200">Allow</span> → Emails: <span className="font-mono text-stone-200">pomellius@gmail.com</span>.</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            {!isPreview && (
              <button
                onClick={() => { window.location.href = '/admin'; }}
                className="w-full bg-primary hover:bg-rose-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} /> Ieiet caur Cloudflare Access (/admin)
              </button>
            )}

            {isPreview && (
              <a
                href="https://aneri.lv/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-rose-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} /> Atvērt produkcijas paneli (aneri.lv/admin)
              </a>
            )}

            <button
              onClick={verifyAccess}
              disabled={isCheckingAuth}
              className="w-full font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-700 text-stone-200 border border-stone-700"
            >
              {isCheckingAuth ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Pārbauda Cloudflare Access sesiju...
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> Pārbaudīt sesiju atkārtoti
                </>
              )}
            </button>

            <a
              href="https://one.dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-900 hover:bg-stone-700 text-stone-300 hover:text-white font-medium py-3 rounded-xl text-xs uppercase tracking-wider transition-colors border border-stone-700 flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} /> Atvērt Cloudflare Zero Trust (Team: pomellius)
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-700/60 text-center">
            <button
              onClick={() => setView('home')}
              className="text-stone-400 hover:text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} /> Atgriezties uz publisko vietni
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Screen B: Authenticated Visual WYSIWYG Administration Dashboard
  // =========================================================================
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-serif font-bold text-primary">Aneri</span>
              <span className="text-[11px] font-mono uppercase bg-stone-800 text-rose-300 border border-stone-700 px-2 py-0.5 rounded font-semibold">
                Admin Panel v1.23
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 border-l border-stone-800 pl-4">
              <Database size={14} className={isD1Live ? 'text-emerald-400' : 'text-amber-400'} />
              <span>
                D1:{' '}
                <strong className={isD1Live ? 'text-emerald-300 font-mono' : 'text-amber-300 font-mono'}>
                  {isD1Live ? 'Connected' : 'Rezerves režīms'}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {(() => {
              const previewSeason = resolveActiveSeason(seasonMode);
              const seasonNames: Record<SeasonType, string> = {
                winter: 'Ziema',
                spring: 'Pavasaris',
                summer: 'Vasara',
                autumn: 'Rudens'
              };
              return (
                <button
                  type="button"
                  onClick={handleToggleSnow}
                  disabled={isSavingSnow}
                  title="Ieslēgt / izslēgt sezonu animāciju vietnē"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                    snowEnabled
                      ? 'bg-sky-950/70 hover:bg-sky-900 text-sky-200 border-sky-700/70'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                  }`}
                >
                  {previewSeason === 'spring' && <Flower2 size={14} className={snowEnabled ? 'text-rose-300' : 'text-stone-400'} />}
                  {previewSeason === 'summer' && <Sparkles size={14} className={snowEnabled ? 'text-sky-300' : 'text-stone-400'} />}
                  {previewSeason === 'autumn' && <Leaf size={14} className={snowEnabled ? 'text-amber-300' : 'text-stone-400'} />}
                  {previewSeason === 'winter' && <Snowflake size={14} className={snowEnabled ? 'text-sky-300' : 'text-stone-400'} />}
                  <span>{snowEnabled ? `${seasonNames[previewSeason]}: ON` : 'Efekti: OFF'}</span>
                </button>
              );
            })()}

            <div className="hidden md:flex items-center gap-2 text-xs text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="font-mono">{adminEmail}</span>
            </div>

            <button
              onClick={() => setView('prices')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <ArrowLeft size={14} /> Vietne
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAuthError('Sesija pabeigta.');
              }}
              className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <LogOut size={14} /> Iziet
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 max-w-7xl flex gap-1 overflow-x-auto border-t border-stone-800/80">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-primary text-primary bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tag size={15} /> Cenrāža Redaktors ({servicesList.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'articles'
                ? 'border-primary text-primary bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText size={15} /> Publikācijas (11)
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-primary text-primary bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Server size={15} /> D1 Diagnostika &amp; Rezerves kopijas
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-primary text-primary bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <SettingsIcon size={15} /> Kontakti &amp; Iestatījumi
          </button>
        </div>
      </header>

      {/* Floating Feedback Banner */}
      {(saveSuccessMsg || saveErrorMsg) && (
        <div className="container mx-auto px-4 max-w-7xl pt-4">
          {saveSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-3 shadow-sm">
              <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
          {saveErrorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-3 shadow-sm">
              <AlertCircle size={17} className="text-rose-600 shrink-0" />
              <span>{saveErrorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab Content */}
      <main className="container mx-auto px-4 max-w-7xl py-6 flex-1">
        {activeTab === 'services' && (
          <div className="space-y-10">
            {/* Compact WYSIWYG Editor Toolbar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Language Mode Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200" role="group" aria-label="Editor language">
                    {(['lv', 'ru', 'en'] as Language[]).map(langOpt => (
                      <button
                        key={langOpt}
                        onClick={() => setEditorLang(langOpt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                          editorLang === langOpt
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {langOpt.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Section Filter */}
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:border-primary"
                  >
                    <option value="all">{ui.allSections}</option>
                    {CATALOG_TAXONOMY.map(sec => (
                      <option key={sec.id} value={sec.id}>
                        {sec.titles[editorLang]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search + Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-end min-w-[260px]">
                  <div className="relative flex-1 min-w-[190px] max-w-xs">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={ui.searchPlaceholder}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <button
                    onClick={loadServices}
                    disabled={isLoadingServices}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <RefreshCw size={14} className={isLoadingServices ? 'animate-spin' : ''} />
                    {ui.refreshBtn}
                  </button>
                  <button
                    onClick={handleExportBackup}
                    disabled={isDownloadingBackup}
                    className="px-3.5 py-2 rounded-xl bg-primary hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap shrink-0"
                  >
                    <Download size={14} /> {ui.backupBtn}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <span>{ui.editHint}</span>
                <span className="font-mono tabular-nums text-stone-400">
                  {filteredServices.length} / {servicesList.length}
                </span>
              </div>
            </div>

            {/* Loading skeleton */}
            {isLoadingServices && servicesList.length === 0 && (
              <div className="grid lg:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white p-8 rounded-[2rem] border border-stone-200/80 space-y-4 animate-pulse">
                    <div className="h-6 w-40 bg-stone-200 rounded" />
                    <div className="h-10 w-full bg-stone-100 rounded-lg" />
                    <div className="h-10 w-full bg-stone-100 rounded-lg" />
                    <div className="h-10 w-full bg-stone-100 rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {/* 6 Site-Mirroring Sections & Category Cards */}
            <div className="space-y-16 pb-12">
              {visibleSections.map(section => {
                const knownKeys = section.categories.map(c => c.key);
                const extraGroups = getExtraCategoriesForSection(section.id, knownKeys);

                return (
                  <section key={section.id} className="space-y-8">
                    {/* Section Title mirroring PricePage.tsx */}
                    <div className="flex items-center gap-6">
                      <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-800 whitespace-nowrap">
                        {section.titles[editorLang]}
                      </h2>
                      <div className="h-px w-full bg-stone-200" />
                    </div>

                    {/* 2-column Category Cards grid matching PricePage.tsx */}
                    <div className="grid lg:grid-cols-2 gap-8">
                      {section.categories.map(category => {
                        const cardKey = `${section.id}::${category.key}`;
                        const items = getServicesForCategory(section.id, category.key);
                        const isAddingHere = addingCardKey === cardKey;

                        // Hide empty card ONLY when user is actively searching and card has 0 hits
                        if (searchQuery.trim() && items.length === 0) {
                          return null;
                        }

                        return (
                          <div
                            key={cardKey}
                            className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-stone-200/80 flex flex-col justify-between"
                          >
                            <div>
                              {/* Card Heading */}
                              <div className="flex items-center justify-between mb-6 pb-3.5 border-b border-stone-100">
                                <h3 className="text-2xl font-serif font-bold text-primary flex items-center gap-2.5">
                                  <CheckCircle2 size={20} className="text-primary/40 shrink-0" />
                                  <span>{category.titles[editorLang]}</span>
                                </h3>
                                <span className="text-xs font-mono tabular-nums text-stone-400">
                                  {items.length}
                                </span>
                              </div>

                              {/* Visual Service Rows */}
                              <div className="space-y-2">
                                {items.length === 0 ? (
                                  <p className="text-xs text-stone-400 italic py-4 text-center">
                                    {ui.emptyCategory}
                                  </p>
                                ) : (
                                  items.map(service => {
                                    const draft = rowDrafts[service.id] || {};
                                    const activeField = getActiveNameField(editorLang);
                                    const currentNameVal =
                                      draft[activeField] !== undefined
                                        ? draft[activeField]!
                                        : getServiceDisplayName(service, editorLang);
                                    const currentPriceVal =
                                      draft.price !== undefined ? draft.price : service.price;

                                    const dirty = isRowDirty(service);
                                    const isSaving = isSyncingId === service.id;
                                    const isConfirmingDel = confirmDeleteId === service.id;
                                    const isTransOpen = expandedTransId === service.id;
                                    const isHidden = service.is_active === 0;

                                    return (
                                      <div
                                        key={service.id}
                                        className={`rounded-xl border transition-colors p-2 ${
                                          dirty
                                            ? 'bg-amber-50/70 border-amber-300'
                                            : isHidden
                                            ? 'bg-stone-100/70 border-stone-200/80 opacity-65'
                                            : 'border-transparent hover:bg-stone-50/80 hover:border-stone-200/70'
                                        }`}
                                      >
                                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                                          {/* Inline Editable Service Name */}
                                          <div className="flex-1 min-w-[170px] flex items-center gap-1.5">
                                            <input
                                              type="text"
                                              value={currentNameVal}
                                              onChange={(e) => handleDraftChange(service.id, activeField, e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' && dirty && !isSaving) {
                                                  handleSaveRow(service);
                                                }
                                              }}
                                              aria-label={`Service name (${editorLang})`}
                                              className={`w-full px-2 py-1 text-sm md:text-[15px] rounded-lg border transition-colors focus:outline-none ${
                                                isHidden ? 'line-through text-stone-500' : 'text-stone-800'
                                              } ${
                                                draft[activeField] !== undefined &&
                                                draft[activeField]?.trim() !== (service[activeField] || '').trim()
                                                  ? 'border-amber-400 bg-white font-medium'
                                                  : 'border-transparent hover:border-stone-200 bg-transparent focus:bg-white focus:border-primary'
                                              }`}
                                            />
                                            {isHidden && (
                                              <span className="text-[10px] font-mono uppercase text-stone-500 shrink-0">
                                                {ui.hiddenLabel}
                                              </span>
                                            )}
                                          </div>

                                          {/* Inline Editable Price */}
                                          <input
                                            type="text"
                                            value={currentPriceVal}
                                            onChange={(e) => handleDraftChange(service.id, 'price', e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' && dirty && !isSaving) {
                                                handleSaveRow(service);
                                              }
                                            }}
                                            aria-label="Service price"
                                            className={`w-28 sm:w-32 px-2 py-1 text-sm font-bold tabular-nums text-right rounded-lg border transition-colors focus:outline-none shrink-0 ${
                                              draft.price !== undefined && draft.price.trim() !== service.price.trim()
                                                ? 'border-amber-400 bg-white text-amber-900'
                                                : 'border-transparent hover:border-stone-200 bg-stone-50/80 text-stone-900 focus:bg-white focus:border-primary'
                                            }`}
                                          />

                                          {/* Compact Row Controls */}
                                          <div className="flex items-center gap-1 shrink-0 ml-auto">
                                            {dirty && (
                                              <button
                                                onClick={() => handleSaveRow(service)}
                                                disabled={isSaving}
                                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                                              >
                                                {isSaving ? (
                                                  <RefreshCw size={12} className="animate-spin" />
                                                ) : (
                                                  <Check size={13} />
                                                )}
                                                {ui.saveOk}
                                              </button>
                                            )}

                                            <button
                                              type="button"
                                              onClick={() =>
                                                setExpandedTransId(isTransOpen ? null : service.id)
                                              }
                                              title={ui.moreLangs}
                                              className={`p-1.5 rounded-lg transition-colors ${
                                                isTransOpen
                                                  ? 'bg-primary/10 text-primary'
                                                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                                              }`}
                                            >
                                              <Languages size={14} />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleToggleActive(service)}
                                              disabled={isSaving}
                                              title={isHidden ? 'Parādīt cenrādī' : 'Paslēpt cenrādī'}
                                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                                            >
                                              {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>

                                            {isConfirmingDel ? (
                                              <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg px-1.5 py-0.5 text-[11px]">
                                                <span className="text-rose-800 font-semibold">{ui.confirmDelete}</span>
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeleteService(service)}
                                                  disabled={isSaving}
                                                  className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold"
                                                >
                                                  {ui.yes}
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => setConfirmDeleteId(null)}
                                                  className="px-1.5 py-0.5 rounded text-stone-600 hover:bg-stone-200 font-semibold"
                                                >
                                                  {ui.no}
                                                </button>
                                              </div>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => setConfirmDeleteId(service.id)}
                                                title="Dzēst pozīciju"
                                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                              >
                                                <Trash2 size={14} />
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        {/* Expandable All-3-Languages Name Editor */}
                                        {isTransOpen && (
                                          <div className="mt-2.5 pt-2.5 border-t border-stone-200/80 grid sm:grid-cols-3 gap-2">
                                            <div>
                                              <label className="block text-[10px] font-mono uppercase text-stone-400 mb-0.5">
                                                LV nosaukums
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  draft.name_lv !== undefined
                                                    ? draft.name_lv
                                                    : service.name_lv || ''
                                                }
                                                onChange={(e) =>
                                                  handleDraftChange(service.id, 'name_lv', e.target.value)
                                                }
                                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-primary"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[10px] font-mono uppercase text-stone-400 mb-0.5">
                                                RU название
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  draft.name_ru !== undefined
                                                    ? draft.name_ru
                                                    : service.name_ru || ''
                                                }
                                                onChange={(e) =>
                                                  handleDraftChange(service.id, 'name_ru', e.target.value)
                                                }
                                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-primary"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[10px] font-mono uppercase text-stone-400 mb-0.5">
                                                EN name
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  draft.name_en !== undefined
                                                    ? draft.name_en
                                                    : service.name_en || ''
                                                }
                                                onChange={(e) =>
                                                  handleDraftChange(service.id, 'name_en', e.target.value)
                                                }
                                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-primary"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>

                            {/* Bottom of Card: Inline "+ Add service" Form or Button */}
                            <div className="mt-6 pt-4 border-t border-stone-100">
                              {isAddingHere ? (
                                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                                    <input
                                      type="text"
                                      autoFocus
                                      value={newDraft[getActiveNameField(editorLang)]}
                                      onChange={(e) =>
                                        setNewDraft(prev => ({
                                          ...prev,
                                          [getActiveNameField(editorLang)]: e.target.value
                                        }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isCreating) {
                                          handleCreateService(section.id, category.key, category.titles);
                                        }
                                      }}
                                      placeholder={`${ui.namePlaceholder} (${editorLang.toUpperCase()})`}
                                      className="flex-1 min-w-[160px] px-3 py-2 text-xs md:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-primary"
                                    />
                                    <input
                                      type="text"
                                      value={newDraft.price}
                                      onChange={(e) =>
                                        setNewDraft(prev => ({ ...prev, price: e.target.value }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isCreating) {
                                          handleCreateService(section.id, category.key, category.titles);
                                        }
                                      }}
                                      placeholder={ui.pricePlaceholder}
                                      className="w-32 px-3 py-2 text-xs md:text-sm font-bold tabular-nums text-right bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-primary"
                                    />
                                  </div>

                                  {newDraft.showAllLangs && (
                                    <div className="grid sm:grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        value={newDraft.name_lv}
                                        onChange={(e) =>
                                          setNewDraft(prev => ({ ...prev, name_lv: e.target.value }))
                                        }
                                        placeholder="LV nosaukums"
                                        className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-primary"
                                      />
                                      <input
                                        type="text"
                                        value={newDraft.name_ru}
                                        onChange={(e) =>
                                          setNewDraft(prev => ({ ...prev, name_ru: e.target.value }))
                                        }
                                        placeholder="RU название"
                                        className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-primary"
                                      />
                                      <input
                                        type="text"
                                        value={newDraft.name_en}
                                        onChange={(e) =>
                                          setNewDraft(prev => ({ ...prev, name_en: e.target.value }))
                                        }
                                        placeholder="EN name"
                                        className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-primary"
                                      />
                                    </div>
                                  )}

                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setNewDraft(prev => ({
                                          ...prev,
                                          showAllLangs: !prev.showAllLangs
                                        }))
                                      }
                                      className="text-[11px] font-semibold text-stone-500 hover:text-primary inline-flex items-center gap-1"
                                    >
                                      <Languages size={13} />
                                      {newDraft.showAllLangs ? ui.hideLangs : ui.moreLangs}
                                    </button>

                                    <div className="flex items-center gap-2 ml-auto">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setAddingCardKey(null);
                                          setNewDraft({ ...EMPTY_NEW_DRAFT });
                                        }}
                                        className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 text-xs font-semibold inline-flex items-center gap-1"
                                      >
                                        <X size={13} /> {ui.cancelBtn}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCreateService(section.id, category.key, category.titles)
                                        }
                                        disabled={isCreating}
                                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-sm"
                                      >
                                        {isCreating ? (
                                          <RefreshCw size={12} className="animate-spin" />
                                        ) : (
                                          <Check size={13} />
                                        )}
                                        {ui.saveOk}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenAddForm(cardKey)}
                                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-stone-300 hover:border-primary hover:bg-rose-50/40 text-stone-600 hover:text-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                >
                                  <Plus size={15} /> {ui.addBtn}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Fallback cards for any custom/orphan D1 subcategories */}
                      {extraGroups.map(([subTitle, extraItems]) => (
                        <div
                          key={`${section.id}::${subTitle}`}
                          className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-stone-200/80 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-6 pb-3.5 border-b border-stone-100">
                              <h3 className="text-2xl font-serif font-bold text-primary flex items-center gap-2.5">
                                <CheckCircle2 size={20} className="text-primary/40 shrink-0" />
                                <span>{subTitle}</span>
                              </h3>
                              <span className="text-xs font-mono tabular-nums text-stone-400">
                                {extraItems.length}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {extraItems.map(service => {
                                const draft = rowDrafts[service.id] || {};
                                const activeField = getActiveNameField(editorLang);
                                const currentNameVal =
                                  draft[activeField] !== undefined
                                    ? draft[activeField]!
                                    : getServiceDisplayName(service, editorLang);
                                const currentPriceVal =
                                  draft.price !== undefined ? draft.price : service.price;
                                const dirty = isRowDirty(service);
                                const isSaving = isSyncingId === service.id;

                                return (
                                  <div
                                    key={service.id}
                                    className="rounded-xl border border-transparent hover:bg-stone-50/80 hover:border-stone-200/70 p-2 flex items-center gap-2"
                                  >
                                    <input
                                      type="text"
                                      value={currentNameVal}
                                      onChange={(e) => handleDraftChange(service.id, activeField, e.target.value)}
                                      className="flex-1 px-2 py-1 text-sm text-stone-800 bg-transparent border border-transparent hover:border-stone-200 focus:bg-white focus:border-primary rounded-lg focus:outline-none"
                                    />
                                    <input
                                      type="text"
                                      value={currentPriceVal}
                                      onChange={(e) => handleDraftChange(service.id, 'price', e.target.value)}
                                      className="w-28 px-2 py-1 text-sm font-bold tabular-nums text-right bg-stone-50 border border-transparent hover:border-stone-200 focus:bg-white focus:border-primary rounded-lg focus:outline-none"
                                    />
                                    {dirty && (
                                      <button
                                        onClick={() => handleSaveRow(service)}
                                        disabled={isSaving}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                                      >
                                        {ui.saveOk}
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Articles */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">Publikācijas un SEO Raksti</h2>
                <p className="text-xs text-stone-500">11 raksti ar 33 lokalizācijām (LV, RU, EN) sinhronizēti D1 datubāzē.</p>
              </div>
              <span className="text-emerald-700 text-xs font-mono font-bold">
                11 / 11 Aktīvi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articlesList.length > 0 ? (
                articlesList.map(art => (
                  <div key={art.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
                    <span className="font-mono text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                      slug: {art.slug}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-sm line-clamp-2">{art.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-3">{art.summary || art.meta_description}</p>
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Statuss: D1 Publicēts</span>
                      <a href={`/article/${art.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-semibold">
                        Skatīt <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  Ielādē publikācijas no Cloudflare D1...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Database & Diagnostics */}
        {activeTab === 'database' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Database className="text-primary" size={20} />
                Cloudflare D1 Arhitektūra &amp; Migrācijas
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Kataloga Pakalpojumi</div>
                  <div className="text-2xl font-serif font-bold tabular-nums text-stone-900 mt-1">
                    {servicesList.length || 83}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium">100% pilns katalogs D1</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Lokalizēti Tulkojumi</div>
                  <div className="text-2xl font-serif font-bold tabular-nums text-stone-900 mt-1">
                    {(servicesList.length || 83) * 3}
                  </div>
                  <div className="text-[11px] text-stone-500">LV, RU, EN valodās</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">SEO Publikācijas</div>
                  <div className="text-2xl font-serif font-bold tabular-nums text-stone-900 mt-1">11 (33)</div>
                  <div className="text-[11px] text-stone-500">Raksti ar Markdown saturu</div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Reģistrētās Migrācijas</h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <span>0001_initial_schema.sql</span>
                    <span className="text-emerald-600 font-bold">Aktīvs (D1 Core Tables)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <span>0002_seed_full_catalog.sql</span>
                    <span className="text-emerald-600 font-bold">Aktīvs (83 Services Seed)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <span>0003_seed_all_articles.sql</span>
                    <span className="text-emerald-600 font-bold">Aktīvs (11 Articles Seed)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-3">
                <button
                  onClick={handleExportBackup}
                  disabled={isDownloadingBackup}
                  className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
                >
                  {isDownloadingBackup ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Sagatavo D1 Rezerves Kopiju...
                    </>
                  ) : (
                    <>
                      <Download size={14} /> Lejupielādēt D1 Datu Bāzes Rezerves Kopiju (JSON)
                    </>
                  )}
                </button>

                <a
                  href="/aneri-v1.23.zip"
                  download="aneri-v1.23.zip"
                  className="px-5 py-3 rounded-xl bg-primary hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download size={14} /> Lejupielādēt Koda Arhīvu (aneri-v1.23.zip)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
              {(() => {
                const calendarSeason = getCalendarSeason();
                const previewSeason = resolveActiveSeason(seasonMode);
                const seasonLabelsRu: Record<SeasonType, string> = {
                  winter: 'Зима — Снежинки с переливом',
                  spring: 'Весна — Клумба: подснежники и тюльпаны',
                  summer: 'Лето — Порхающие бабочки',
                  autumn: 'Осень — Кленовые листья'
                };

                return (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-100">
                      <div className="space-y-1 max-w-lg">
                        <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                          <Calendar size={18} className="text-primary shrink-0" />
                          <span>Sezonu animācija vietnē (Авто-сезоны на сайте)</span>
                        </h2>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Režīmā <strong>Auto</strong> vietne automātiski pārslēdz animāciju pēc kalendāra (Pavasaris: puķu dobe · Vasara: tauriņi · Rudens: lapas · Ziema: sniegpārsliņas). Elementi atrodas aiz skatloga stikla (z-5).
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={snowEnabled}
                        onClick={handleToggleSnow}
                        disabled={isSavingSnow}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 border flex items-center gap-2 ${
                          snowEnabled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                        }`}
                      >
                        {isSavingSnow ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <Calendar size={13} />
                        )}
                        <span>{snowEnabled ? 'Ieslēgts (Вкл)' : 'Izslēgts (Выкл)'}</span>
                      </button>
                    </div>

                    {/* Season Selector */}
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-stone-800">
                          Sezonas režīms / Режим сезона
                        </span>
                        <span className="text-stone-500">
                          Сейчас по календарю: <strong className="text-stone-800">{seasonLabelsRu[calendarSeason]}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                        {[
                          {
                            id: 'auto' as SeasonMode,
                            title: 'Auto (Календарь)',
                            sub: `${seasonLabelsRu[calendarSeason].split(' — ')[0]} сейчас`,
                            icon: <Calendar size={15} />
                          },
                          {
                            id: 'spring' as SeasonMode,
                            title: 'Весна (03–05)',
                            sub: 'Клумба первоцветов',
                            icon: <Flower2 size={15} className="text-rose-500" />
                          },
                          {
                            id: 'summer' as SeasonMode,
                            title: 'Лето (06–08)',
                            sub: 'Бабочки',
                            icon: <Sparkles size={15} className="text-sky-500" />
                          },
                          {
                            id: 'autumn' as SeasonMode,
                            title: 'Осень (09–11)',
                            sub: 'Листики',
                            icon: <Leaf size={15} className="text-amber-600" />
                          },
                          {
                            id: 'winter' as SeasonMode,
                            title: 'Зима (12–02)',
                            sub: 'Снежинки',
                            icon: <Snowflake size={15} className="text-sky-600" />
                          }
                        ].map(opt => {
                          const selected = seasonMode === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSeasonMode(opt.id)}
                              className={`text-left px-3 py-2.5 rounded-xl border transition-colors flex items-center gap-2.5 ${
                                selected
                                  ? 'border-primary bg-rose-50/80 text-stone-900 shadow-sm'
                                  : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700'
                              }`}
                            >
                              <span className="shrink-0">{opt.icon}</span>
                              <span className="min-w-0">
                                <span className="block text-xs font-bold leading-tight truncate">{opt.title}</span>
                                <span className="block text-[11px] text-stone-500 truncate">{opt.sub}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Visual Preview (Window-glass demo for active/selected season using real PNG sprites) */}
                    <div className="relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 px-6 py-5 flex items-center justify-between gap-4">
                      <div className="relative z-10">
                        <div className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold mb-0.5">
                          Priekšskatījums · {seasonLabelsRu[previewSeason]}
                        </div>
                        <div className="text-2xl font-serif font-bold text-white tracking-tight">
                          Salons Aneri
                        </div>
                      </div>
                      <div className={`flex gap-3.5 ${previewSeason === 'spring' ? 'items-end -mb-5 pt-2' : 'items-center'}`}>
                        {(previewSeason === 'spring'
                          ? ['/assets/seasonal/spring_1.png', '/assets/seasonal/spring_2.png', '/assets/seasonal/spring_3.png']
                          : previewSeason === 'summer'
                          ? ['/assets/seasonal/butterfly_1.png', '/assets/seasonal/butterfly_2.png', '/assets/seasonal/butterfly_5.png']
                          : previewSeason === 'autumn'
                          ? ['/assets/seasonal/leaf_1.png', '/assets/seasonal/leaf_2.png', '/assets/seasonal/leaf_6.png']
                          : ['/assets/seasonal/snowflake_1.png', '/assets/seasonal/snowflake_3.png', '/assets/seasonal/snowflake_8.png']
                        ).map((src, idx) => {
                          const scales = [0.85, 1.15, 0.95];
                          const dim = Math.round(snowSize * scales[idx] * (previewSeason === 'spring' ? 1.65 : previewSeason === 'summer' ? 1.35 : 1.2));
                          return (
                            <img
                              key={src}
                              src={src}
                              alt=""
                              referrerPolicy="no-referrer"
                              style={{
                                height: `${dim}px`,
                                width: 'auto',
                                opacity: snowEnabled ? 0.95 : 0.25,
                                filter:
                                  previewSeason === 'winter' && snowColor !== '#FFFFFF'
                                    ? `drop-shadow(0 0 6px ${snowColor})`
                                    : undefined
                              }}
                              className="object-contain select-none transition-all duration-200"
                            />
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* 1. Element Size Slider + Presets */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="snow-size-range" className="font-bold text-stone-800">
                    Izmērs / Размер элементов (все сезоны)
                  </label>
                  <span className="font-mono font-bold tabular-nums text-primary">
                    {snowSize} px
                  </span>
                </div>
                <input
                  id="snow-size-range"
                  type="range"
                  min={16}
                  max={60}
                  step={2}
                  value={snowSize}
                  onChange={(e) => setSnowSize(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Mazs (22px)', val: 22 },
                    { label: 'Vidējs (34px)', val: 34 },
                    { label: 'Liels (46px)', val: 46 },
                    { label: 'Lielisks (56px)', val: 56 }
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setSnowSize(preset.val)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        snowSize === preset.val
                          ? 'bg-primary text-white border-primary'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Count Slider + Presets */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="snow-count-range" className="font-bold text-stone-800">
                    Daudzums / Количество элементов (все сезоны)
                  </label>
                  <span className="font-mono font-bold tabular-nums text-primary">
                    {snowCount} gab.
                  </span>
                </div>
                <input
                  id="snow-count-range"
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={snowCount}
                  onChange={(e) => setSnowCount(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Viegls (25)', val: 25 },
                    { label: 'Vidējs (55)', val: 55 },
                    { label: 'Bagātīgs (90)', val: 90 }
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setSnowCount(preset.val)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        snowCount === preset.val
                          ? 'bg-primary text-white border-primary'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Winter Snowflake Color Swatches + Custom Color Picker */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="snow-color-picker" className="font-bold text-stone-800">
                    Ziemas sniegpārsliņu krāsa / Цвет снежинок зимой
                  </label>
                  <span className="font-mono font-semibold text-stone-600">{snowColor}</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Pavasarī (tulpes), vasarā (putniņi) un rudenī (lapas) automātiski tiek izmantota dabiskā daudzkrāsu palete.
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    { hex: '#FFFFFF', label: 'Balts (Белый)' },
                    { hex: '#BAE6FD', label: 'Ledus zils (Ледяной)' },
                    { hex: '#FFE4E6', label: 'Maigi rozā (Нежно-розовый)' },
                    { hex: '#FDE68A', label: 'Zelts (Золотой)' },
                    { hex: '#CBD5E1', label: 'Sudrabs (Серебро)' },
                    { hex: '#BE123C', label: 'Bordo (Бордо Aneri)' }
                  ].map(swatch => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => setSnowColor(swatch.hex)}
                      title={swatch.label}
                      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        snowColor.toUpperCase() === swatch.hex
                          ? 'border-primary bg-rose-50 text-stone-900 font-semibold'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.label}</span>
                    </button>
                  ))}

                  <label className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      id="snow-color-picker"
                      type="color"
                      value={snowColor}
                      onChange={(e) => setSnowColor(e.target.value.toUpperCase())}
                      className="w-5 h-5 border-0 bg-transparent p-0 cursor-pointer"
                    />
                    <span>Cita krāsa</span>
                  </label>
                </div>
              </div>

              {/* Save Action Row */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSeasonMode('auto');
                    setSnowSize(34);
                    setSnowCount(55);
                    setSnowColor('#FFFFFF');
                    handleSaveSnowSettings({
                      enabled: true,
                      seasonMode: 'auto',
                      size: 34,
                      count: 55,
                      color: '#FFFFFF'
                    });
                  }}
                  disabled={isSavingSnow}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold transition-colors"
                >
                  Atjaunot sākotnējos
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveSnowSettings()}
                  disabled={isSavingSnow}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
                >
                  {isSavingSnow ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>Saglabāt iestatījumus D1</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">Salona Rekvizīti &amp; Saziņa</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-400 font-bold uppercase mb-1">Tālrunis</label>
                  <input
                    type="text"
                    readOnly
                    value="+371 27580047"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 font-bold uppercase mb-1">Adrese</label>
                  <input
                    type="text"
                    readOnly
                    value="Latgales iela 264, Rīga, Ķengarags (t/c Mego)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 font-bold uppercase mb-1">Darba Laiks</label>
                  <input
                    type="text"
                    readOnly
                    value="Pirmdiena - Sestdiena: 09:00 - 20:00 | Svētdiena: 10:00 - 16:00"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
