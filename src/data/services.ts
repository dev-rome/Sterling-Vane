export type Service = {
  slug: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

export const services: Service[] = [
  {
    slug: "signature-cut",
    name: "The Signature Cut",
    description:
      "Consultation, precision cut, wash, style and hot-towel finish.",
    price: 65,
    duration: 60,
  },
  {
    slug: "hot-towel-shave",
    name: "Hot Towel Shave",
    description:
      "Straight razor, hot lather, essential oils and a cold-towel close.",
    price: 55,
    duration: 45,
  },
  {
    slug: "full-ritual",
    name: "The Full Ritual",
    description:
      "Signature Cut and Hot Towel Shave, scalp massage and a pour of something good.",
    price: 120,
    duration: 90,
  },
  {
    slug: "skin-fade",
    name: "Skin Fade",
    description:
      "Seamless taper from skin to length with a foil-sharp line-up.",
    price: 55,
    duration: 45,
  },
  {
    slug: "beard-sculpt",
    name: "Beard Sculpt",
    description: "Shape, line-up, hot towel and a cedar conditioning oil.",
    price: 40,
    duration: 30,
  },
  {
    slug: "junior-cut",
    name: "Junior Cut",
    description: "The full treatment for young gentlemen, ages 12 and under.",
    price: 40,
    duration: 30,
  },
];
