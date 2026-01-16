
import React from 'react';
import { Language, Content } from '../types';

interface SchemaMarkupProps {
  content: Content;
  lang: Language;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ content, lang }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": "https://aneri.lv",
    "name": "Salons Aneri",
    "url": "https://aneri.lv",
    "image": "https://aneri-icon.pages.dev/photo/facade.jpg",
    "telephone": "+371 27580047",
    "sameAs": [
      "https://www.instagram.com/salons_aneri/",
      "https://www.facebook.com/61568612101531/about/"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Latgales iela 264",
      "addressLocality": "Rīga",
      "addressRegion": "Ķengarags",
      "postalCode": "LV-1063",
      "addressCountry": "LV"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 56.9085003,
      "longitude": 24.1822941
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": "Cash",
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Frizētavas pakalpojumi / Hairdressing / Парикмахерские услуги"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Manikīrs un Pedikīrs / Manicure & Pedicure / Маникюр и Педикюр"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Solārijs / Solarium / Солярий"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Permanentais grims / Permanent Makeup / Перманентный макияж"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Kosmetoloģija / Cosmetology / Косметология"
        }
      }
    ]
  };

  // Safe flattening of FAQ items compatible with older browsers (replacing flatMap)
  const faqItems = content.faq.categories.reduce((acc, category) => {
    return acc.concat(category.items);
  }, [] as typeof content.faq.categories[0]['items']);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

export default SchemaMarkup;
