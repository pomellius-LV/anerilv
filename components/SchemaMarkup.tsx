import React from 'react';
import { Language, Content, View } from '../types';
import {
  SERVICE_SECTION_IDS,
  THEMATIC_SERVICES_SEO,
  STATIC_PAGES_SEO,
  ServiceSectionId,
  buildSeoUrl
} from '../data/seoRoutes';
import { dataService } from '../services/dataService';

interface SchemaMarkupProps {
  content: Content;
  lang: Language;
  view?: View;
  serviceId?: ServiceSectionId;
  articleId?: string;
}

const BASE_URL = 'https://aneri.lv';

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({
  content,
  lang,
  view = 'home',
  serviceId,
  articleId
}) => {
  if (view === 'admin') {
    return null;
  }

  const googleProfile = dataService.getGoogleProfile();
  const hasRealRating =
    googleProfile.rating !== '' &&
    googleProfile.reviewsCount !== '' &&
    Number(googleProfile.reviewsCount) > 0;

  const salonSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${BASE_URL}/#salon`,
    name: 'Salons Aneri',
    url: BASE_URL,
    image: [
      `${BASE_URL}/assets/services/hair.jpg`,
      'https://aneri-icon.pages.dev/photo/facade.jpg'
    ],
    telephone: '+371 27580047',
    sameAs: [
      'https://www.instagram.com/salons_aneri/',
      'https://www.facebook.com/61568612101531/about/'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Latgales iela 264',
      addressLocality: 'Rīga',
      addressRegion: 'Ķengarags',
      postalCode: 'LV-1063',
      addressCountry: 'LV'
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Rīga'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Ķengarags'
      }
    ],
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Free Private Client Parking',
        value: true
      }
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 56.9085003,
      longitude: 24.1822941
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        opens: '09:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00'
      }
    ],
    priceRange: '$$',
    paymentAccepted: 'Cash',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:
        lang === 'lv'
          ? 'Salons Aneri Pakalpojumu Katalogs'
          : lang === 'ru'
          ? 'Каталог услуг Салона Aneri'
          : 'Aneri Salon Service Catalog',
      itemListElement: SERVICE_SECTION_IDS.map(sId => {
        const svc = THEMATIC_SERVICES_SEO[sId];
        return {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: svc.cardLabels[lang],
            description: svc.descriptions[lang],
            url: `${BASE_URL}${buildSeoUrl(lang, 'service', { serviceId: sId })}`
          }
        };
      })
    }
  };

  // Only emit AggregateRating when genuine Google profile numbers are entered in AdminPanel D1 settings
  if (hasRealRating) {
    salonSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: googleProfile.rating,
      reviewCount: Number(googleProfile.reviewsCount),
      bestRating: '5',
      worstRating: '1'
    };
  }

  // Contextual FAQ schema: specific FAQs on thematic service pages, full FAQ otherwise
  const faqItems =
    view === 'service' && serviceId && THEMATIC_SERVICES_SEO[serviceId]
      ? THEMATIC_SERVICES_SEO[serviceId].faqs[lang]
      : content.faq.categories.reduce(
          (acc, category) => acc.concat(category.items),
          [] as typeof content.faq.categories[0]['items']
        );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  // Dynamic BreadcrumbList matching current route
  const breadcrumbItems: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: content.nav.home,
      item: `${BASE_URL}${buildSeoUrl(lang, 'home')}`
    }
  ];

  if (view === 'service' && serviceId && THEMATIC_SERVICES_SEO[serviceId]) {
    const svc = THEMATIC_SERVICES_SEO[serviceId];
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: content.nav.prices,
      item: `${BASE_URL}${buildSeoUrl(lang, 'prices')}`
    });
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: svc.cardLabels[lang],
      item: `${BASE_URL}${buildSeoUrl(lang, 'service', { serviceId })}`
    });
  } else if (view === 'article' && articleId) {
    const article = content.articles?.find(a => a.id === articleId);
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: article ? article.title : articleId,
      item: `${BASE_URL}${buildSeoUrl(lang, 'article', { articleId })}`
    });
  } else if (view !== 'home') {
    const staticLabel =
      view === 'prices'
        ? content.nav.prices
        : view === 'gallery'
        ? content.nav.gallery
        : view === 'faq'
        ? content.nav.faq
        : STATIC_PAGES_SEO[view as 'terms' | 'privacy']?.[lang]?.h1 || view;

    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: staticLabel,
      item: `${BASE_URL}${buildSeoUrl(lang, view)}`
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  };

  // Dedicated Service Schema on thematic landing pages
  const servicePageSchema =
    view === 'service' && serviceId && THEMATIC_SERVICES_SEO[serviceId]
      ? {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: THEMATIC_SERVICES_SEO[serviceId].cardLabels[lang],
          description: THEMATIC_SERVICES_SEO[serviceId].descriptions[lang],
          image: `${BASE_URL}/assets/services/${serviceId}.jpg`,
          url: `${BASE_URL}${buildSeoUrl(lang, 'service', { serviceId })}`,
          areaServed: {
            '@type': 'City',
            name: 'Rīga'
          },
          provider: {
            '@id': `${BASE_URL}/#salon`
          }
        }
      : null;

  // BlogPosting Schema on article views
  const currentArticle =
    view === 'article' && articleId
      ? content.articles?.find(a => a.id === articleId)
      : undefined;

  const articleSchema = currentArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: currentArticle.title,
        description: currentArticle.metaDescription,
        image: `${BASE_URL}/assets/services/hair.jpg`,
        inLanguage: lang,
        mainEntityOfPage: `${BASE_URL}${buildSeoUrl(lang, 'article', { articleId })}`,
        author: {
          '@type': 'Organization',
          name: 'Salons Aneri',
          url: BASE_URL
        },
        publisher: {
          '@id': `${BASE_URL}/#salon`
        }
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(salonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {servicePageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicePageSchema) }}
        />
      )}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
    </>
  );
};

export default SchemaMarkup;
