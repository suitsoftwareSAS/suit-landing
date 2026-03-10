"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  readMore?: string;
  items: Gallery4Item[];
}

// Transforms an Unsplash/Imgix URL to request a specific format and width
function buildImgixUrl(url: string, format: string, width: number): string {
  const parsed = new URL(url);
  parsed.searchParams.set("w", String(width));
  parsed.searchParams.set("q", "90");
  parsed.searchParams.set("fm", format);
  return parsed.toString();
}

const Gallery4 = ({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences.",
  readMore = "Read more",
  items,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  // Auto-play functionality
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const autoPlay = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(autoPlay);
  }, [carouselApi]);

  return (
    <section className="py-0">
      <div className="mb-12 reveal-on-scroll">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-center text-surface-900 dark:text-white mb-4 font-sans">
          {title}
        </h3>
        <p className="text-center max-w-3xl mx-auto text-lg sm:text-xl text-surface-600 dark:text-surface-300 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="w-full -mx-4 sm:-mx-6 lg:-mx-8 relative">
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 justify-between px-4 sm:px-6 lg:px-8 pointer-events-none">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollPrev();
            }}
            disabled={!canScrollPrev}
            className="disabled:pointer-events-auto pointer-events-auto bg-white dark:bg-surface-800 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-surface-900 dark:text-white border-2 border-surface-200 dark:border-surface-700 shadow-lg hover:shadow-xl transition-all hover:scale-110"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="disabled:pointer-events-auto pointer-events-auto bg-white dark:bg-surface-800 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-surface-900 dark:text-white border-2 border-surface-200 dark:border-surface-700 shadow-lg hover:shadow-xl transition-all hover:scale-110"
          >
            <ArrowRight className="size-5" />
          </Button>
        </div>
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-4 sm:ml-6 lg:ml-8">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group block rounded-2xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-2xl md:aspect-[5/4] lg:aspect-[16/9] border-2 border-surface-200 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600 transition-all duration-300 hover:shadow-2xl">
                    <picture>
                      {/* AVIF — best compression, supported by modern browsers */}
                      <source
                        type="image/avif"
                        srcSet={`${buildImgixUrl(item.image, "avif", 640)} 640w, ${buildImgixUrl(item.image, "avif", 1280)} 1280w`}
                        sizes="(max-width: 768px) 640px, 1280px"
                      />
                      {/* WebP — wide browser support, good compression */}
                      <source
                        type="image/webp"
                        srcSet={`${buildImgixUrl(item.image, "webp", 640)} 640w, ${buildImgixUrl(item.image, "webp", 1280)} 1280w`}
                        sizes="(max-width: 768px) 640px, 1280px"
                      />
                      {/* JPEG fallback */}
                      <img
                        src={buildImgixUrl(item.image, "jpg", 1280)}
                        srcSet={`${buildImgixUrl(item.image, "jpg", 640)} 640w, ${buildImgixUrl(item.image, "jpg", 1280)} 1280w`}
                        sizes="(max-width: 768px) 640px, 1280px"
                        alt={item.title}
                        className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute inset-0 h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(34,9,44,0.4)_60%,rgba(34,9,44,0.9)_100%)] dark:bg-[linear-gradient(to_bottom,transparent_0%,rgba(34,9,44,0.5)_60%,rgba(34,9,44,0.95)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8 text-white">
                      <h4 className="mb-3 text-xl font-bold md:text-2xl leading-tight">
                        {item.title}
                      </h4>
                      <p className="mb-6 line-clamp-2 text-base text-white/90 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                        {readMore}{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center">
          {items.map((_, index) => (
            <button
              key={index}
              className="group flex items-center justify-center min-h-11 min-w-11"
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 h-2 ${
                  currentSlide === index
                    ? "bg-brand-600 dark:bg-brand-500 w-8"
                    : "w-2 bg-surface-300 dark:bg-surface-600 group-hover:bg-brand-400 dark:group-hover:bg-brand-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };
