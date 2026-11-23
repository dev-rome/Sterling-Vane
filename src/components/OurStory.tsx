import Image from "next/image";
import storyImage from "../../public/images/story.jpg";

const stats = [
  { value: "4", label: "Chairs, never more" },
  { value: "18k+", label: "Cuts delivered" },
  { value: "3", label: "Master barbers" },
];

export function OurStory() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="mx-auto flex max-w-site flex-col gap-16 px-5 py-24 md:flex-row md:items-center md:gap-20 md:px-8 md:py-36"
    >
      <div className="relative md:flex-1">
        <div className="relative aspect-4/5 overflow-hidden md:aspect-auto md:h-150">
          <Image
            src={storyImage}
            alt="A tattooed barber cleaning up a client's neckline with a straight razor and comb"
            fill
            placeholder="blur"
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </div>

        <div className="absolute -bottom-6 right-4 flex size-34 md:size-45 flex-col items-center justify-center border border-amber bg-espresso text-center md:-right-6">
          <span className="font-display text-[3rem] md:text-[4rem] leading-none text-amber">
            12
          </span>
          <span className="mt-1 text-[0.625rem] md:text-[0.6875rem] uppercase leading-snug tracking-[0.22em] text-stone">
            Years on
            <br />
            Fulton Market
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-1">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-amber">
          Our story
        </p>

        <h2
          id="story-heading"
          className="font-display text-[clamp(2.5rem,1.75rem+3vw,3.75rem)] font-normal leading-[1.02]"
        >
          Quiet precision,
          <br />
          <em className="text-amber">passed hand to hand.</em>
        </h2>

        <p className="text-stone">
          Sterling &amp; Vane began with two chairs and one rule: never rush a
          guest. Twelve years later we still book one client per barber per
          hour, still heat every towel by hand and still finish every cut with a
          straight razor.
        </p>
        <p className="text-stone">
          Walnut, brass, worn leather and a good pour on the house. It&apos;s
          the hour of your week that belongs to no one else.
        </p>

        <dl className="mt-2 grid grid-cols-3 gap-6 border-t border-line pt-7">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end gap-1"
            >
              <dt className="text-[0.8125rem] text-stone">{stat.label}</dt>
              <dd className="font-display text-[2.5rem] leading-none">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
