
export type Language = 'lv' | 'ru' | 'en';
export type View = 'home' | 'faq' | 'terms' | 'privacy' | 'prices' | 'gallery';

export interface ServiceItem {
  id: string; // added for anchor linking
  title: string;
  description: string;
  longDescription: string;
  keywords: string[];
  image: string; // kept for compatibility, but optional in new design
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  categoryTitle: string;
  items: FAQItem[];
}

export interface PriceService {
  name: string;
  price: string;
}

export interface PriceCategory {
  title: string;
  services: PriceService[];
}

export interface PriceSection {
  id: string; // added for anchor linking
  sectionTitle: string;
  categories: PriceCategory[];
}

export interface GalleryCategory {
  id: string; // folder name
  title: string;
  image: string; // cover image for category
}

export interface Content {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  nav: {
    home: string;
    services: string;
    prices: string;
    gallery: string;
    contacts: string;
    faq: string;
    bookBtn: string;
    installApp: string; // New field for PWA install button text
  };
  hero: {
    title: string;
    subText: string;
    cta: string;
  };
  services: {
    title: string;
    items: ServiceItem[]; // Changed from fixed object to array for flexibility
  };
  prices: {
    title: string;
    description: string;
    disclaimer: string;
    sections: PriceSection[];
  };
  gallery: {
    title: string;
    description: string;
    categories: GalleryCategory[];
    showMore: string; // NEW
    instagramBtn: string; // NEW
  };
  advantages: {
    title: string;
    items: string[];
  };
  faq: {
    title: string;
    description: string;
    categories: FAQCategory[];
  };
  terms: {
    title: string;
    content: string;
  };
  privacy: {
    title: string;
    content: string;
  };
  footer: {
    addressLabel: string;
    phoneLabel: string;
    hoursLabel: string;
    hours: string;
    copyright: string;
    quickLinks: string;
    termsLabel: string;
    privacyLabel: string;
  };
  cookie: {
    text: string;
    btn: string;
  };
}
