export type Review = {
  quote: string;
  name: string;
  detail: string;
};

export const featuredReview: Review = {
  quote:
    "The only hour of my week where nobody needs anything from me. Best shave in Chicago, and it isn’t close.",
  name: "Daniel R.",
  detail: "Guest since 2019",
};

export const reviews: Review[] = [
  {
    quote:
      "Julian listened, asked the right questions and gave me the best cut I’ve had in years. Booking took thirty seconds.",
    name: "Andre M.",
    detail: "Signature Cut",
  },
  {
    quote:
      "Came in for a beard trim, left with a hot towel, an espresso and a standing monthly appointment.",
    name: "Kevin L.",
    detail: "Beard Sculpt",
  },
];
