import Image from "next/image";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";

export function Shop() {
  return (
    <section
      id="shop"
      aria-labelledby="shop-heading"
      className="border-y border-line bg-walnut"
    >
      <div className="mx-auto max-w-site px-5 py-24 md:px-8 md:py-32">
        <div className="mb-14 flex max-w-136 flex-col gap-4 md:mb-16">
          <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
            Take it home
          </p>
          <h2
            id="shop-heading"
            className="font-display text-[clamp(2.5rem,1.75rem+3vw,3.5rem)] leading-none font-normal"
          >
            Grooming <em className="text-amber">Essentials</em>
          </h2>
          <p className="text-stone">
            The products we use in the chair, available in the shop.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.slug} className="flex flex-col gap-4">
              <div className="relative aspect-4/5 overflow-hidden border border-line">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
                  className={`object-cover ${product.imagePosition}`}
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.625rem] tracking-[0.3em] text-stone uppercase">
                    No. {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-[1.5rem] leading-tight font-medium">
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone">
                    {product.variant} · {product.detail}
                  </p>
                </div>
                <p className="font-display text-[1.5rem] text-amber">
                  {formatPrice.format(product.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
