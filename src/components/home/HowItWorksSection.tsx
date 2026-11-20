
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Search,
    Heart,
    CalendarCheck,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Explore Services",
        description:
            "Browse different wedding categories and discover services that match your vision and budget.",
    },
    {
        number: "02",
        icon: Heart,
        title: "Choose Your Vendor",
        description:
            "Compare available wedding professionals and choose the perfect vendors for your celebration.",
    },
    {
        number: "03",
        icon: CalendarCheck,
        title: "Book Your Service",
        description:
            "Send your booking request and start organizing your dream wedding with confidence.",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="overflow-hidden bg-[#fffaf7] px-5 py-20 lg:px-8 lg:py-24">

            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mx-auto mb-16 max-w-2xl text-center">

                    <span className="text-xs font-bold uppercase tracking-[3px] text-[#f45b4f]">
                        Simple & Easy
                    </span>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#302521] sm:text-4xl">
                        How WedPlan
                        <span className="text-[#f45b4f]"> Works</span>
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-[#88766e] sm:text-base">
                        Your dream wedding is just a few steps away.
                        Follow our simple process and make wedding
                        planning a beautiful experience.
                    </p>

                </div>

                {/* Steps */}
                <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">

                    {/* Connecting Line */}
                    <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden border-t-2 border-dashed border-[#f2c7bb] md:block" />

                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="relative z-10 flex flex-col items-center text-center"
                            >

                                {/* Step Icon */}
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-white bg-[#f45b4f] text-white shadow-lg shadow-[#f45b4f]/20">
                                    <Icon size={29} strokeWidth={1.8} />
                                </div>

                                {/* Step Number */}
                                <span className="mt-6 rounded-full bg-[#f45b4f]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#f45b4f]">
                                    STEP {step.number}
                                </span>

                                {/* Content */}
                                <h3 className="mt-4 text-xl font-bold text-[#302521]">
                                    {step.title}
                                </h3>

                                <p className="mt-3 max-w-sm text-sm leading-7 text-[#88766e]">
                                    {step.description}
                                </p>

                            </div>
                        );
                    })}

                </div>

                {/* Bottom CTA */}
                <div className="mt-16 rounded-3xl bg-[#302521] px-6 py-10 text-center sm:px-10">

                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                        Ready to Plan Your Dream Wedding?
                    </h3>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#d2c2bc]">
                        Discover amazing wedding services and find
                        the right professionals for your special day.
                    </p>

                    <div className="mt-7 flex w-full justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 min-w-[160px] whitespace-nowrap rounded-full bg-[#f45b4f] px-7 text-white hover:bg-[#df493e]"
                        >
                            <Link
                                href="/services"
                                className="inline-flex flex-nowrap items-center justify-center gap-2"
                            >
                                <span>Explore Services</span>
                                <ArrowRight className="h-4 w-4 shrink-0" />
                            </Link>
                        </Button>
                    </div>

                </div>

            </div>
        </section>
    );
}
