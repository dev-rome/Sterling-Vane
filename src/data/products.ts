import type { StaticImageData } from "next/image";
import product1 from "../../public/images/product-1.jpg";
import product2 from "../../public/images/product-2.jpg";
import product3 from "../../public/images/product-3.jpg";
import product4 from "../../public/images/product-4.jpg";

export type Product = {
  slug: string;
  name: string;
  variant: string;
  detail: string;
  price: number;
  image: StaticImageData;
  imageAlt: string;
  imagePosition: string;
};

export const products: Product[] = [
  {
    slug: "beard-oil",
    name: "Beard Oil",
    variant: "Cedar & Smoke",
    detail: "30 ml",
    price: 32,
    image: product1,
    imageAlt: "Amber dropper bottle of beard oil on a dark wooden surface",
    imagePosition: "object-[50%_70%]",
  },
  {
    slug: "shaping-clay",
    name: "Shaping Clay",
    variant: "Matte · Strong hold",
    detail: "75 g",
    price: 28,
    image: product2,
    imageAlt: "Amber jars of shaping clay arranged on dark stone",
    imagePosition: "object-center",
  },
  {
    slug: "shave-soap",
    name: "Shave Soap",
    variant: "Sandalwood",
    detail: "100 g bar",
    price: 36,
    image: product3,
    imageAlt: "White shave soap bar beside an amber pump bottle on dark stone",
    imagePosition: "object-center",
  },
  {
    slug: "shave-brush",
    name: "Shave Brush",
    variant: "Silvertip",
    detail: "Black & chrome handle",
    price: 64,
    image: product4,
    imageAlt:
      "Close-up of a silvertip shaving brush with a black and chrome handle",
    imagePosition: "object-[70%_50%]",
  },
];
