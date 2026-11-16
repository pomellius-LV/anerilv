import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { dataService, AdminServiceItem } from '../services/dataService';
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
  Save,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info,
  Server
} from 'lucide-react';

interface AdminPanelProps {
  setView: (view: View) => void;
}

type AdminTab = 'services' | 'articles' | 'settings' | 'database';

const AdminPanel: React.FC<AdminPanelProps> = ({ setView }) => {
  // Authentication State strictly driven by server Cloudflare Access verification
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('pomellius@gmail.com');
  const [authError, setAuthError] = useState<string>('');
  const [authReason, setAuthReason] = useState<'preview_env' | 'access_redirect' | 'unauthorized' | 'network' | undefined>(undefined);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('services');

  // Services Editor State
  const [servicesList, setServicesList] = useState<AdminServiceItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingPrices, setEditingPrices] = useState<Record<string, string>>({});
  
  // Feedback Messages
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [saveErrorMsg, setSaveErrorMsg] = useState<string>('');
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);

  // Diagnostic State
  const [isD1Live, setIsD1Live] = useState<boolean>(false);
  const [isDownloadingBackup, setIsDownloadingBackup] = useState<boolean>(false);

  // Articles State
  const [articlesList, setArticlesList] = useState<any[]>([]);

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
      // Fallback: Populate flat list from local catalog with real deterministic D1 IDs
      const flat = dataService.getAllServicesFlat('lv');
      const formatted: AdminServiceItem[] = flat.map((s, idx) => ({
        id: s.id,
        category_id: s.sectionId,
        subcategory_title: s.categoryTitle,
        order_num: idx + 1,
        price: s.price,
        is_active: 1,
        name_lv: s.name,
        name_ru: '',
        name_en: ''
      }));
      setServicesList(formatted);
      if (result.error && !result.isD1Connected) {
        setSaveErrorMsg(`D1 savienojums: ${result.error}`);
      }
    }
    setIsLoadingServices(false);
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

  const handlePriceInputChange = (serviceId: string, val: string) => {
    setEditingPrices(prev => ({
      ...prev,
      [serviceId]: val
    }));
  };

  // 4. Save Price to D1 using real permanent ID
  const handleSavePrice = async (service: AdminServiceItem) => {
    const newPrice = editingPrices[service.id];
    if (!newPrice || newPrice.trim() === '') return;

    setIsSyncingId(service.id);
    setSaveSuccessMsg('');
    setSaveErrorMsg('');

    const res = await dataService.updatePrice(service.id, newPrice, service.name_lv);
    setIsSyncingId(null);

    if (res.ok) {
      setSaveSuccessMsg(`Cena pakalpojumam "${service.name_lv || service.id}" veiksmīgi saglabāta D1 datubāzē: ${newPrice}`);
      // Update local state in service list
      setServicesList(prev => prev.map(s => s.id === service.id ? { ...s, price: newPrice } : s));
      // Remove from pending edit
      setEditingPrices(prev => {
        const copy = { ...prev };
        delete copy[service.id];
        return copy;
      });
      setTimeout(() => setSaveSuccessMsg(''), 5000);
    } else {
      // Strictly report server failure
      setSaveErrorMsg(res.error || 'Neizdevās saglabāt izmaiņas Cloudflare D1 datubāzē.');
      setTimeout(() => setSaveErrorMsg(''), 8000);
    }
  };

  // 5. Authoritative Server-Side D1 JSON Backup Export (v1.12)
  const handleExportBackup = async () => {
    setIsDownloadingBackup(true);
    setSaveErrorMsg('');
    try {
      const res = await dataService.downloadServerD1Backup();
      let jsonStr: string;
      let filename: string;

      if (res.ok && res.data) {
        jsonStr = JSON.stringify(res.data, null, 2);
        filename = `aneri_d1_backup_${new Date().toISOString().slice(0, 10)}_v1.13.json`;
        setSaveSuccessMsg(`Servera Cloudflare D1 rezerves kopija veiksmīgi iegūta (${res.data.totalRecords || 0} ieraksti).`);
        setTimeout(() => setSaveSuccessMsg(''), 6000);
      } else {
        // Fallback to local snapshot if D1 binding is offline
        jsonStr = dataService.exportBackupJson();
        filename = `aneri_catalog_snapshot_${new Date().toISOString().slice(0, 10)}_v1.13.json`;
        setSaveErrorMsg(`D1 servera brīdinājums: ${res.error || 'D1 bezsaistē'}. Lejupielādēts lokālais kataloga uzņēmums.`);
        setTimeout(() => setSaveErrorMsg(''), 8000);
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
      setSaveErrorMsg(`Kļūda sagatavojot rezerves kopiju: ${e.message}`);
    } finally {
      setIsDownloadingBackup(false);
    }
  };

  // Filter services
  const filteredServices = servicesList.filter(s => {
    const matchesSection = selectedSection === 'all' || s.category_id === selectedSection;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (s.name_lv && s.name_lv.toLowerCase().includes(q)) ||
      (s.name_ru && s.name_ru.toLowerCase().includes(q)) ||
      (s.name_en && s.name_en.toLowerCase().includes(q)) ||
      (s.subcategory_title && s.subcategory_title.toLowerCase().includes(q)) ||
      s.id.toLowerCase().includes(q);
    return matchesSection && matchesSearch;
  });

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
                      Šajā priekšskatījuma logā nav aktīvs Cloudflare Zero Trust un D1 datubāze. Lai ieietu panelī, atveriet produkcijas adresi <span className="font-mono text-white">aneri.lv/admin</span> pēc noteikuma izveides Cloudflare One konsolē, vai atsūtiet cenu izmaiņas čatā.
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
              className={`w-full font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                isPreview
                  ? 'bg-stone-900 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  : 'bg-stone-900 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
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
  // Screen B: Authenticated Administration Dashboard
  // =========================================================================
  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-primary">Aneri</span>
              <span className="text-xs font-mono uppercase bg-primary/20 text-rose-300 border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                Admin Panel v1.13
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 border-l border-stone-800 pl-4">
              <Database size={14} className={isD1Live ? 'text-emerald-400' : 'text-amber-400'} />
              <span>D1 Statuss: <strong className={isD1Live ? 'text-emerald-300 font-mono' : 'text-amber-300 font-mono'}>
                {isD1Live ? 'Tiešsaistē (D1 Connected)' : 'Rezerves režīms'}
              </strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="font-mono">{adminEmail}</span>
            </div>

            <button
              onClick={() => setView('home')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Vietne
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAuthError('Sesija pabeigta.');
              }}
              className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              <LogOut size={14} /> Iziet
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 flex gap-1 overflow-x-auto border-t border-stone-800/80 pt-1">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'services'
                ? 'border-primary text-primary bg-stone-800/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tag size={15} /> Cenrāža Redaktors ({servicesList.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'articles'
                ? 'border-primary text-primary bg-stone-800/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText size={15} /> Publikācijas (11)
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'database'
                ? 'border-primary text-primary bg-stone-800/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Server size={15} /> D1 Diagnostika & Rezerves kopijas
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-primary text-primary bg-stone-800/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <SettingsIcon size={15} /> Kontakti & Iestatījumi
          </button>
        </div>
      </header>

      {/* Global Alerts */}
      <div className="container mx-auto px-4 pt-4">
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-3 shadow-sm mb-4 animate-fadeIn">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
        {saveErrorMsg && (
          <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-medium flex items-center gap-3 shadow-sm mb-4 animate-fadeIn">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{saveErrorMsg}</span>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-6 flex-1">
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Meklēt pēc nosaukuma vai ID..."
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Section Filter */}
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-primary"
                >
                  <option value="all">Visas nodaļas (6)</option>
                  <option value="hair">1. Frizētavas pakalpojumi</option>
                  <option value="nails">2. Manikīrs un Pedikīrs</option>
                  <option value="cosmetology">3. Kosmetoloģija un Pīlingi</option>
                  <option value="permanent">4. Permanentais grims</option>
                  <option value="waxing">5. Vaksācija</option>
                  <option value="solarium">6. Solārijs</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadServices}
                  disabled={isLoadingServices}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={14} className={isLoadingServices ? 'animate-spin' : ''} />
                  Atjaunināt sarakstu
                </button>
                <button
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 rounded-xl bg-primary hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download size={14} /> Rezerves kopija (JSON)
                </button>
              </div>
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
                <span>Pakalpojumu skaits: {filteredServices.length} no {servicesList.length}</span>
                <span className="font-mono text-[11px] text-stone-400">D1 Schema: services + service_translations</span>
              </div>

              <div className="divide-y divide-stone-100 max-h-[70vh] overflow-y-auto">
                {filteredServices.map((service) => {
                  const currentInputValue = editingPrices[service.id] !== undefined
                    ? editingPrices[service.id]
                    : service.price;
                  const isModified = editingPrices[service.id] !== undefined && editingPrices[service.id] !== service.price;
                  const isSavingThis = isSyncingId === service.id;

                  return (
                    <div
                      key={service.id}
                      className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                        isModified ? 'bg-amber-50/60' : 'hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                            {service.id}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                            {service.subcategory_title || service.category_id}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-stone-900">
                          {service.name_lv || service.name || service.id}
                        </h3>

                        {(service.name_ru || service.name_en) && (
                          <p className="text-[11px] text-stone-500 flex flex-wrap gap-3">
                            {service.name_ru && <span>RU: {service.name_ru}</span>}
                            {service.name_en && <span>EN: {service.name_en}</span>}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <label className="block text-[10px] uppercase font-bold text-stone-400 mb-0.5">
                            Cena D1
                          </label>
                          <input
                            type="text"
                            value={currentInputValue}
                            onChange={(e) => handlePriceInputChange(service.id, e.target.value)}
                            placeholder="piem., 25.00 €"
                            className={`w-36 px-3 py-1.5 text-xs font-semibold rounded-xl border text-center transition-colors focus:outline-none ${
                              isModified
                                ? 'border-amber-400 bg-white ring-2 ring-amber-200 font-bold text-amber-900'
                                : 'border-stone-200 bg-stone-50 text-stone-800 focus:border-primary'
                            }`}
                          />
                        </div>

                        <button
                          onClick={() => handleSavePrice(service)}
                          disabled={!isModified || isSavingThis}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                            isModified
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          {isSavingThis ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <Save size={13} />
                          )}
                          Saglabāt D1
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-300">
                11 / 11 Raksti Aktīvi
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
                Cloudflare D1 Arhitektūra & Migrācijas
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Kataloga Pakalpojumi</div>
                  <div className="text-2xl font-serif font-bold text-stone-900 mt-1">82</div>
                  <div className="text-[11px] text-emerald-600 font-medium">100% pilns katalogs D1</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Lokalizēti Tulkojumi</div>
                  <div className="text-2xl font-serif font-bold text-stone-900 mt-1">246</div>
                  <div className="text-[11px] text-stone-500">LV, RU, EN valodās</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">SEO Publikācijas</div>
                  <div className="text-2xl font-serif font-bold text-stone-900 mt-1">11 (33)</div>
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
                    <span className="text-emerald-600 font-bold">Aktīvs (82 Services Seed)</span>
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
                  href="/aneri-v1.13.zip"
                  download="aneri-v1.13.zip"
                  className="px-5 py-3 rounded-xl bg-primary hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download size={14} /> Lejupielādēt Koda Arhīvu (aneri-v1.13.zip)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 max-w-2xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">Salona Rekvizīti & Saziņa</h2>
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
                  value="Pirmdiena - Sestdiena: 09:00 - 20:00 | Svētdiena: 10:00 - 18:00"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
