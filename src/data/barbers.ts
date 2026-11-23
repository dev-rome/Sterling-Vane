import type { StaticImageData } from "next/image";
import barber1 from "../../public/images/barber-1.jpg";
import barber2 from "../../public/images/barber-2.jpg";
import barber3 from "../../public/images/barber-3.jpg";

export type Barber = {
  slug: string;
  name: string;
  title: string;
  years: number;
  specialty: string;
  image: StaticImageData;
  imageAlt: string;
  imagePosition: string;
};

export const barbers: Barber[] = [
  {
    slug: "julian",
    name: "Julian Ortiz",
    title: "Master Barber",
    years: 14,
    specialty: "Scissor work & longer styles",
    image: barber2,
    imageAlt: "Julian shaping a client's hair with scissors and a comb",
    imagePosition: "object-center",
  },
  {
    slug: "marcus",
    name: "Marcus Hale",
    title: "Senior Barber",
    years: 9,
    specialty: "Fades & beard work",
    image: barber1,
    imageAlt: "Marcus trimming a client's beard",
    imagePosition: "object-[75%_50%]",
  },
  {
    slug: "theo",
    name: "Theo Grant",
    title: "Shave Specialist",
    years: 7,
    specialty: "Straight razor & beard",
    image: barber3,
    imageAlt: "Theo preparing a client for a hot-towel shave",
    imagePosition: "object-center",
  },
];
