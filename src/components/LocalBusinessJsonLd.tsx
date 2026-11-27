import { shop } from "@/data/shop";
import { openingHours } from "@/lib/schedule";
import { siteUrl } from "@/lib/site";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// 10 → "10:00"
const toTime = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

const openingHoursSpecification = Object.entries(openingHours).flatMap(
  ([day, hours]) =>
    hours
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: dayNames[Number(day)],
            opens: toTime(hours.open),
            closes: toTime(hours.close),
          },
        ]
      : [],
);

const data = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: shop.name,
  description: shop.tagline,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  telephone: shop.phone.href.replace("tel:", ""),
  email: shop.email,
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: shop.address.city,
    addressRegion: shop.address.region,
    postalCode: shop.address.postalCode,
    addressCountry: "US",
  },
  areaServed: shop.address.area,
  openingHoursSpecification,
};

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" stops any text in the data from closing the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
