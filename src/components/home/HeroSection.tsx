
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
    ArrowRight,
    Heart,
    Sparkles,
    Camera,
    Flower2,
    Building2,
    CheckCircle2,
    Star,
} from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#fffaf7]">

            {/* Background */}
            <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#f45b4f]/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#f7c9b9]/30 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

                {/* LEFT CONTENT */}
                <div className="relative z-10">

                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f4d5cc] bg-white px-4 py-2 shadow-sm">
                        <Sparkles size={15} className="text-[#f45b4f]" />
                        <span className="text-xs font-semibold tracking-wide text-[#8e655b]">
                            YOUR DREAM WEDDING STARTS HERE
                        </span>
                    </div>

                    <h1 className="max-w-xl font-serif text-4xl font-bold leading-tight tracking-tight text-[#302521] sm:text-5xl lg:text-6xl">
                        Everything for
                        <span className="block text-[#e84f49]">
                            Your Perfect Wedding
                        </span>
                    </h1>

                    <p className="mt-6 max-w-lg text-base leading-8 text-[#806f68] sm:text-lg">
                        Find beautiful wedding venues, professional photographers,
                        talented decorators and trusted vendors. Plan every
                        detail of your special day with WedPlan.
                    </p>

                    {/* CTA */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">

                        {/* <Button
              size="lg"
              className="h-12 rounded-full bg-[#f45b4f] px-7 text-white shadow-lg shadow-[#f45b4f]/20 hover:bg-[#df493e]"
            >
              <Link href="/services">
                Explore Wedding Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button> */}


                        <Link
                            href="/services"
                            className="rounded-full bg-[#f45b4f] px-6 py-4 text-sm font-medium text-white shadow-md shadow-[#f45b4f]/20 transition hover:bg-[#df493e]"
                        >
                            Explore Wedding Services
                        </Link>

                        <Link
                            href="/dashboard/vendor"
                            className="flex items-center gap-2 text-sm font-semibold text-[#806f68] transition hover:text-[#e84f49]"
                        >
                            Become a Vendor
                            <ArrowRight size={16} />
                        </Link>

                    </div>

                    {/* Highlights */}
                    <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#eeded7] pt-6 sm:gap-6">

                        <div>
                            <h3 className="text-2xl font-bold text-[#302521]">100%</h3>
                            <p className="mt-1 text-xs text-[#917f77]">Wedding Focused</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-[#302521]">All-in-One</h3>
                            <p className="mt-1 text-xs text-[#917f77]">Planning Platform</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-[#302521]">Easy</h3>
                            <p className="mt-1 text-xs text-[#917f77]">Service Booking</p>
                        </div>

                    </div>
                </div>

                {/* RIGHT VISUAL */}
                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">

                    {/* Main Wedding Image */}
                    <div className="relative overflow-hidden rounded-[28px] border-[7px] border-white shadow-2xl shadow-[#8b6250]/15">

                        <img
                            src="https://images-pw.pixieset.com/elementfield/GG07Kxy/South.Asian.Wedding.hanover.marriott.indian.wedding_0121_72-b56848ec-1500.jpg"
                            alt="South Asian bride and groom at a beautiful floral wedding venue"
                            className="h-[420px] w-full object-cover object-center sm:h-[540px] lg:h-[570px]"
                            loading="eager"
                        />

                    </div>

                    {/* Photography Badge */}
                    <div className="absolute -left-3 top-10 flex items-center gap-3 rounded-xl border border-[#f5e7e0] bg-white p-3 shadow-xl sm:-left-7">
                        <div className="rounded-lg bg-[#fff0ed] p-2 text-[#e84f49]">
                            <Camera size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#302521]">Photography</p>
                            <p className="text-[10px] text-[#917f77]">Capture memories</p>
                        </div>
                    </div>

                    {/* Decoration Badge */}
                    <div className="absolute right-3 top-24 flex items-center gap-3 rounded-xl border border-[#f5e7e0] bg-white p-3 shadow-xl sm:-right-5">
                        <div className="rounded-lg bg-[#fff0ed] p-2 text-[#e84f49]">
                            <Flower2 size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#302521]">Decoration</p>
                            <p className="text-[10px] text-[#917f77]">Beautiful setups</p>
                        </div>
                    </div>

                    {/* Venue Badge */}
                    <div className="absolute bottom-16 -left-3 flex items-center gap-3 rounded-xl border border-[#f5e7e0] bg-white p-3 shadow-xl sm:-left-7">
                        <div className="rounded-lg bg-[#fff0ed] p-2 text-[#e84f49]">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#302521]">Wedding Venues</p>
                            <p className="text-[10px] text-[#917f77]">Find your dream place</p>
                        </div>
                    </div>

                    {/* Bottom Floating Card */}
                    <div className="absolute -bottom-6 right-3 flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-2xl sm:-right-5 sm:p-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0ed]">
                            <Heart size={22} fill="#f45b4f" className="text-[#f45b4f]" />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-[#302521]">
                                Plan with WedPlan
                            </p>
                            <div className="mt-1 flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-green-600" />
                                <span className="text-[10px] text-[#917f77]">
                                    Everything in one place
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Decorative Star */}
                    <div className="absolute -right-3 -top-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f45b4f] text-white shadow-lg">
                        <Star size={20} fill="currentColor" />
                    </div>

                </div>
            </div>
        </section>
    );
}
