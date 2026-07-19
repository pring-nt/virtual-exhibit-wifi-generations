import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    useCarousel,
} from "@/components/ui/carousel";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { StandardsData } from "./StandardsData";

function Dots() {
    const { api } = useCarousel();
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!api) return;
        setSelectedIndex(api.selectedScrollSnap());
        const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[60%]">
            {StandardsData.map((_, i) => (
                <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === selectedIndex
                            ? "bg-[var(--c-ink)] w-6"
                            : "bg-[var(--c-rule)] hover:bg-[var(--c-muted)] w-2.5"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                />
            ))}
        </div>
    );
}

export default function StandardsCarousel() {
    return (
        <div className="wifi-explorer">
            <Carousel
                className="w-full max-w-2xl mx-auto relative"
                opts={{ align: "start", loop: true }}
            >
                <CarouselContent className="-ml-0 gap-4 py-1">
                    {StandardsData.map((standard) => (
                        <CarouselItem key={standard.id} className="basis-full pl-0 flex-none min-w-0 w-full">
                            <Card className="h-[420px] sm:h-[380px] flex flex-col border-[var(--c-rule)] rounded-lg shadow-none
                            bg-[var(--c-cream)] overflow-hidden transform-gpu backface-hidden">
                                <CardHeader className="pb-2 flex-none">
                                    <CardTitle className="font-heading text-lg text-[var(--c-ink)]">
                                        {standard.title}
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {standard.badges.map((badge) => (
                                            <span
                                                key={badge.label}
                                                className={`badge ${badge.className}`}
                                            >
                                            {badge.label}
                                        </span>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-auto space-y-2 text-sm leading-relaxed text-[var(--c-muted)] pb-6">
                                    <p>{standard.p1}</p>
                                    <p>{standard.p2}</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="flex items-center justify-between mt-5 px-1">
                    <CarouselPrevious className="static translate-y-0 h-10 w-10 sm:h-9 sm:w-9 border-[var(--c-rule)] text-[var(--c-ink)] hover:bg-[var(--c-rule)]/20" />
                    <Dots />
                    <CarouselNext className="static translate-y-0 h-10 w-10 sm:h-9 sm:w-9 border-[var(--c-rule)] text-[var(--c-ink)] hover:bg-[var(--c-rule)]/20" />
                </div>
            </Carousel>
        </div>
    );
}