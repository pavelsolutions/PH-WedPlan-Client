
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Recently Married",
    initials: "SJ",
    rating: 5,
    review:
      "WedPlan made our wedding planning so much easier. We found an amazing photographer and beautiful decoration services in one place. Highly recommended!",
  },
  {
    name: "Michael Anderson",
    role: "Recently Married",
    initials: "MA",
    rating: 5,
    review:
      "Finding the right wedding vendors was always stressful for us. WedPlan helped us discover professionals who perfectly matched our vision.",
  },
  {
    name: "Emily Williams",
    role: "Recently Married",
    initials: "EW",
    rating: 5,
    review:
      "From photography to wedding decoration, everything became easier to organize. I love how simple and convenient the platform is.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[3px] text-[#f45b4f]">
            Happy Couples
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[#302521] sm:text-4xl">
            Love Stories &{" "}
            <span className="text-[#f45b4f]">Happy Memories</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#88766e] sm:text-base">
            Discover what couples say about their wedding
            planning experience with WedPlan.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group relative rounded-2xl border border-[#f1e5df] bg-[#fffaf7] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#f45b4f]/30 hover:shadow-xl hover:shadow-[#f45b4f]/5"
            >
              <Quote
                size={35}
                className="absolute right-6 top-6 text-[#f45b4f]/20"
              />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="#f4ae45"
                    className="text-[#f4ae45]"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="mt-6 min-h-[120px] text-sm leading-7 text-[#806f68]">
                "{item.review}"
              </p>

              {/* Customer */}
              <div className="mt-7 flex items-center gap-3 border-t border-[#eee1da] pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f45b4f]/10 text-sm font-bold text-[#f45b4f]">
                  {item.initials}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#302521]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#a18d84]">
                    {item.role}
                  </p>
                </div>

                <div className="ml-auto rounded-full bg-[#eaf7ee] px-3 py-1 text-[10px] font-semibold text-[#398451]">
                  Sample
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
