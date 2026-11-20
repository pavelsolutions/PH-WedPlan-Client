
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#fffaf7]">
            {/* Decorative Background */}
            <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#f45b4f]/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#f7c9b9]/30 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

                {/* Left Content */}
                <div className="relative z-10">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f4d5cc] bg-white px-4 py-2">
                        <Sparkles size={15} className="text-[#f45b4f]" />
                        <span className="text-xs font-semibold tracking-wide text-[#8e655b]">
                            YOUR DREAM WEDDING STARTS HERE
                        </span>
                    </div>

                    <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#302521] sm:text-5xl lg:text-6xl">
                        Make Your Wedding
                        <span className="block text-[#f45b4f]">
                            Truly Unforgettable
                        </span>
                    </h1>

                    <p className="mt-6 max-w-lg text-base leading-8 text-[#806f68] sm:text-lg">
                        Discover trusted wedding photographers, beautiful
                        venues, talented decorators, and professional
                        vendors. Everything you need to create your
                        perfect wedding, all in one place.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <div className="mt-8 flex w-full justify-center lg:justify-start">
                            <Button
                                asChild
                                size="lg"
                                className="h-12 min-w-[230px] rounded-full bg-[#f45b4f] px-7 text-white shadow-lg shadow-[#f45b4f]/20 hover:bg-[#df493e]"
                            >
                                <Link
                                    href="/services"
                                    className="inline-flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <span>Explore Wedding Services</span>
                                    <ArrowRight className="h-4 w-4 shrink-0" />
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-[#806f68]">
                            <Heart size={17} className="text-[#f45b4f]" />
                            Plan with love
                        </div>
                    </div>

                    {/* Small Highlights */}
                    <div className="mt-10 flex flex-wrap gap-6 border-t border-[#eeded7] pt-6">
                        <div>
                            <h3 className="text-2xl font-bold text-[#302521]">
                                100%
                            </h3>
                            <p className="mt-1 text-xs text-[#917f77]">
                                Wedding Focused
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-[#302521]">
                                All-in-One
                            </h3>
                            <p className="mt-1 text-xs text-[#917f77]">
                                Planning Platform
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-[#302521]">
                                Easy
                            </h3>
                            <p className="mt-1 text-xs text-[#917f77]">
                                Service Booking
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">

                    <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[#f45b4f]/15" />
                    <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full bg-[#f3d5c8]/70" />

                    <div className="relative overflow-hidden rounded-t-[180px] rounded-b-3xl border-[8px] border-white shadow-2xl shadow-[#8b6250]/15">
                        <div
                            role="img"
                            aria-label="Beautiful wedding bouquet and romantic wedding decoration"
                            className="h-[400px] bg-cover bg-center sm:h-[500px]"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=85')",
                            }}
                        />
                    </div>

                    {/* Floating Card */}
                    <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-10">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0eb]">
                            <Heart
                                size={21}
                                className="text-[#f45b4f]"
                                fill="#f45b4f"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-[#302521]">
                                Your Day, Your Way
                            </p>
                            <p className="text-xs text-[#917f77]">
                                Every detail matters
                            </p>
                        </div>
                    </div>

                    <div className="absolute right-5 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#f45b4f] text-white shadow-lg">
                        <Sparkles size={22} />
                    </div>
                </div>

            </div>
        </section>
    );
}
