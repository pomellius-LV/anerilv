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
    "name": "Salons Aneri",
    "image": "photos/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Latgales iela 264",
      "addressLocality": "Rīga",
      "postalCode": "LV-1063",
      "addressCountry": "LV"
    },
    "priceRange": "$$",
    "telephone": "+371 27580047",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "18:00"
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