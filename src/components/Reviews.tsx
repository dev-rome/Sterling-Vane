import { featuredReview, reviews } from "@/data/reviews";

function Stars() {
  return (
    <p className="text-lg tracking-[0.3em] text-amber">
      <span aria-hidden="true">★★★★★</span>
      <span className="sr-only">Rated 5 out of 5</span>
    </p>
  );
}

export function Reviews() {
  return (
    <section aria-labelledby="reviews-heading" className="border-t border-line">
      <div className="mx-auto max-w-site px-5 py-24 md:px-8 md:py-32">
        <h2 id="reviews-heading" className="sr-only">
          What our guests say
        </h2>

        <figure className="mx-auto flex max-w-[50rem] flex-col items-center gap-7 text-center">
          <Stars />
          <blockquote className="font-display text-[clamp(1.75rem,1.25rem+2vw,2.625rem)] leading-tight font-normal italic">
            <p>&ldquo;{featuredReview.quote}&rdquo;</p>
          </blockquote>
          <figcaption className="text-xs tracking-[0.22em] text-stone uppercase">
            {featuredReview.name} · {featuredReview.detail}
          </figcaption>
        </figure>

        <ul className="mt-20 grid gap-6 border-t border-line pt-14 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.name}>
              <figure className="flex h-full flex-col gap-4 border border-line bg-card p-8">
                <Stars />
                <blockquote className="flex-1 text-[1.0625rem]">
                  <p>&ldquo;{review.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="text-xs tracking-[0.22em] text-stone uppercase">
                  {review.name} · {review.detail}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-stone">
          Sample reviews for this concept project.
        </p>
      </div>
    </section>
  );
}
