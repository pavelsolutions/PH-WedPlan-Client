
"use client";

import Link from "next/link";
import {
    motion,
    useReducedMotion,
} from "framer-motion";
import {
    Camera,
    MapPin,
    Flower2,
    UtensilsCrossed,
    Sparkles,
    Shirt,
    ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories = [
    {
        name: "Photography & Videography",
        description:
            "Capture every beautiful moment, emotion and memory of your special day.",
        image:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
        icon: Camera,
        label: "Capture moments",
    },
    {
        name: "Wedding Venues",
        description:
            "Discover beautiful venues to create the perfect setting for your wedding.",
        image:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85",
        icon: MapPin,
        label: "Dream locations",
    },
    {
        name: "Decoration & Florist",
        description:
            "Transform your wedding into a magical celebration with stunning decor.",
        image:
            "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1000&q=85",
        icon: Flower2,
        label: "Beautiful details",
    },
    {
        name: "Catering Services",
        description:
            "Treat your guests to delicious menus and unforgettable dining experiences.",
        image:
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85",
        icon: UtensilsCrossed,
        label: "Taste & celebrate",
    },
    {
        name: "Makeup & Styling",
        description:
            "Find talented beauty artists to help you shine on your big day.",
        image:
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
        icon: Sparkles,
        label: "Beauty & glam",
    },
    {
        name: "Wedding Fashion",
        description:
            "Explore elegant bridal wear, outfits and styles for your celebration.",
        image:
            "https://images.unsplash.com/photo-1594552072238-b4a3a0f2a9e6?auto=format&fit=crop&w=1000&q=85",
        icon: Shirt,
        label: "Wedding style",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 35,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export default function WeddingServiceCategories() {
    const shouldReduceMotion = useReducedMotion();

    const reveal = shouldReduceMotion
        ? {
            hidden: { opacity: 1 },
            visible: { opacity: 1 },
        }
        : cardVariants;

    const stagger = shouldReduceMotion
        ? {}
        : containerVariants;

    return (
        <section
            id="wedding-categories"
            className="relative overflow-hidden bg-[#FCF9F7] py-20 sm:py-24 lg:py-28"
        >
            {/* Decorative background */}
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#dc2027]/[0.04] blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[#D8B6A8]/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dc2027]/15 bg-[#dc2027]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#dc2027]">
                        <Sparkles size={14} />
                        Wedding Services
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-[#302326] sm:text-4xl lg:text-5xl">
                        Plan Your Wedding,
                        <span className="mt-2 block font-serif font-normal italic text-[#dc2027]">
                            Your Way
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#78676B] sm:text-base">
                        Discover everything you need for your special day.
                        From dream venues to talented wedding professionals,
                        find the perfect services to bring your vision to life.
                    </p>
                </motion.div>

                {/* Category Cards */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.12 }}
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
                >
                    {categories.map((category, index) => {
                        const Icon = category.icon;

                        return (
                            <motion.div
                                key={category.name}
                                variants={reveal}
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                            y: -6,
                                            transition: { duration: 0.25 },
                                        }
                                }
                                className="group"
                            >
                                <Link
                                    href={`/services?category=${encodeURIComponent(category.name)}`}
                                    className="relative block h-[360px] overflow-hidden rounded-2xl bg-[#E8DCD8] shadow-sm ring-1 ring-black/[0.03] sm:h-[390px]"
                                >
                                    {/* Image */}
                                    <motion.div
                                        className="absolute inset-0"
                                        whileHover={
                                            shouldReduceMotion
                                                ? undefined
                                                : { scale: 1.06 }
                                        }
                                        transition={{
                                            duration: 0.65,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        <div
                                            className="h-full w-full bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${category.image})`,
                                            }}
                                        />
                                    </motion.div>

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-colors duration-500 group-hover:from-[#641C2C]/90" />

                                    {/* Category Icon */}
                                    <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#dc2027]">
                                        <Icon size={20} strokeWidth={1.8} />
                                    </div>

                                    {/* Category Label */}
                                    <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                                        {category.label}
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                                        <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/65">
                                            Category {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <h3 className="max-w-[280px] text-2xl font-semibold leading-tight text-white sm:text-[26px]">
                                            {category.name}
                                        </h3>

                                        <p className="mt-3 max-w-[300px] text-sm leading-6 text-white/75">
                                            {category.description}
                                        </p>

                                        {/* Bottom Action */}
                                        <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                                            <span className="text-sm font-medium text-white">
                                                Explore Category
                                            </span>

                                            <motion.div
                                                whileHover={
                                                    shouldReduceMotion
                                                        ? undefined
                                                        : {
                                                            rotate: 45,
                                                            scale: 1.08,
                                                        }
                                                }
                                                transition={{ duration: 0.25 }}
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#dc2027] transition-colors duration-300 group-hover:bg-[#dc2027] group-hover:text-white"
                                            >
                                                <ArrowUpRight size={18} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mt-12 flex justify-center"
                >
                    <Link
                        href="/services"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#dc2027]/25 bg-[#ee5151] px-7 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#7B2032] hover:shadow-md"
                    >
                        <span className="whitespace-nowrap">Explore All Services</span>

                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
