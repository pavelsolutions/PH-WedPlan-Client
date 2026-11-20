
import {
  ShieldCheck,
  Search,
  CalendarCheck,
  HeartHandshake,
} from "lucide-react";

const benefits = [
  {
    icon: Search,
    title: "Easy Service Discovery",
    description:
      "Explore a wide range of wedding services and find the perfect professionals for your special day.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Vendors",
    description:
      "Discover reliable wedding vendors and make your decisions with greater confidence.",
  },
  {
    icon: CalendarCheck,
    title: "Simple Booking",
    description:
      "Find your favorite services and organize your wedding bookings in one convenient place.",
  },
  {
    icon: HeartHandshake,
    title: "Everything in One Place",
    description:
      "From photography to decoration, discover everything you need for your dream wedding.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-24">

      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <span className="text-xs font-bold uppercase tracking-[3px] text-[#f45b4f]">
            Why WedPlan?
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#302521] sm:text-4xl">
            Your Perfect Wedding,
            <span className="text-[#f45b4f]"> Made Easier</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#88766e] sm:text-base">
            Planning a wedding should be exciting, not stressful.
            WedPlan brings everything together to help you
            create a celebration worth remembering.
          </p>

        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-[#f2e8e3] bg-[#fffaf7] p-7 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#f45b4f]/30 hover:shadow-xl hover:shadow-[#f45b4f]/5"
              >

                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f45b4f]/10 transition-colors duration-300 group-hover:bg-[#f45b4f]">
                  <Icon
                    size={27}
                    strokeWidth={1.7}
                    className="text-[#f45b4f] transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                {/* Number */}
                <p className="mt-5 text-xs font-bold tracking-widest text-[#f0a69b]">
                  0{index + 1}
                </p>

                {/* Title */}
                <h3 className="mt-3 text-lg font-bold text-[#302521]">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-7 text-[#88766e]">
                  {benefit.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
