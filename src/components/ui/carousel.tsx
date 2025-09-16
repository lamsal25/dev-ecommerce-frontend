"use client";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Interface for image slide
interface ImageSlide {
  src: string;
  alt: string;
}

// Props for the Carousel component
interface CarouselProps {
  images: ImageSlide[];
  options?: any;
  className?: string;
  activeSlider?: boolean;
  isAutoPlay?: boolean;
  isScale?: boolean;
  showThumbnails?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  options = { loop: true },
  className,
  activeSlider = true,
  isAutoPlay = false,
  isScale = false,
  showThumbnails = true,
}) => {
  const carouselId = useId();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Plugins setup
  const plugins = [];
  if (activeSlider) {
    plugins.push(ClassNames());
  }
  if (isAutoPlay) {
    plugins.push(
      Autoplay({
        playOnInit: true,
        delay: 3000,
        stopOnMouseEnter: true,
        jump: false,
        stopOnInteraction: false,
      })
    );
  }

  // Main carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  // Thumbnails carousel
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  // Sync thumbnails with main carousel
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !emblaThumbsApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi, emblaThumbsApi]
  );

  // Update thumbnail selection on main carousel change
  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap());
  }, [emblaApi, emblaThumbsApi, setSelectedIndex]);

  // Dot button functionality
  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Next/Prev button functionality
  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  // Update button states
  const updateButtonStates = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  // Update scroll progress
  const onScroll = useCallback((emblaApi: any) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  // Initialize carousel
  useEffect(() => {
    if (!emblaApi) return;

    // Setup event handlers
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      updateButtonStates(emblaApi);
      onScroll(emblaApi);
      onSelect();
    };

    onInit();

    // Always start with the first (main) image
    emblaApi.scrollTo(0);
    setSelectedIndex(0);

    // Event listeners
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
    emblaApi.on("select", () => updateButtonStates(emblaApi));
    emblaApi.on("scroll", () => onScroll(emblaApi));

    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("select", onSelect);
      emblaApi.off("select", () => updateButtonStates(emblaApi));
      emblaApi.off("scroll", () => onScroll(emblaApi));
    };
  }, [emblaApi, onSelect, updateButtonStates, onScroll]);

  // Scale animation
  const TWEEN_FACTOR_BASE = 0.52;
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback(
    (emblaApi: any): void => {
      if (!isScale) return;
      tweenNodes.current = emblaApi
        .slideNodes()
        .map((slideNode: any, index: number) => {
          const node = slideNode.querySelector(
            ".slider_content"
          ) as HTMLElement;
          if (!node) {
            console.warn(`No .slider_content found for slide ${index}`);
          }
          return node;
        });
    },
    [isScale]
  );

  const setTweenFactor = useCallback(
    (emblaApi: any) => {
      if (!isScale) return;
      tweenFactor.current =
        TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
    },
    [isScale]
  );

  const numberWithinRange = (
    number: number,
    min: number,
    max: number
  ): number => Math.min(Math.max(number, min), max);

  const tweenScale = useCallback(
    (emblaApi: any, eventName?: string) => {
      if (!isScale) return;
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi
        .scrollSnapList()
        .forEach((scrollSnap: number, snapIndex: number) => {
          let diffToTarget = scrollSnap - scrollProgress;
          const slidesInSnap = engine.slideRegistry[snapIndex];

          slidesInSnap.forEach((slideIndex: number) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem: any) => {
                const target = loopItem.target();

                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);

                  if (sign === -1) {
                    diffToTarget = scrollSnap - (1 + scrollProgress);
                  }
                  if (sign === 1) {
                    diffToTarget = scrollSnap + (1 - scrollProgress);
                  }
                }
              });
            }

            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const scale = numberWithinRange(tweenValue, 0, 1).toString();
            const tweenNode = tweenNodes.current[slideIndex];
            if (tweenNode) {
              tweenNode.style.transform = `scale(${scale})`;
            }
          });
        });
    },
    [isScale]
  );

  // Scale animation effect
  useEffect(() => {
    if (!emblaApi || !isScale) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale);

    return () => {
      emblaApi
        .off("reInit", setTweenNodes)
        .off("reInit", setTweenFactor)
        .off("reInit", tweenScale)
        .off("scroll", tweenScale);
    };
  }, [emblaApi, isScale, tweenScale, setTweenNodes, setTweenFactor]);

  // Handle empty carousel
  if (!images || images.length === 0) {
    return (
      <div className="rounded-md bg-gray-100 h-64 flex items-center justify-center">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div className={cn("relative", className)}>
        <div className={cn("overflow-hidden ")} ref={emblaRef}>
          <div className="flex" style={{ touchAction: "pan-y pinch-zoom" }}>
            {images.map((image, index) => (
              <div
                key={`slide-${index}`}
                className="min-w-0 flex-grow-0 flex-shrink-0 w-full"
              >
                {isScale ? (
                  <div className="slider_content h-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-[500px] object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Progress indicator dots */}
        <div className="flex justify-center mt-4 absolute bottom-4 left-0 right-0">
          <div className="flex gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => onDotButtonClick(index)}
                className="relative inline-flex p-0 m-0 w-3 h-3"
              >
                <div className="bg-white/50 h-3 w-3 rounded-full"></div>
                {index === selectedIndex && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      transition={{
                        layout: {
                          duration: 0.4,
                          ease: "easeInOut",
                          delay: 0.04,
                        },
                      }}
                      layoutId={`hover-${carouselId}`}
                      className="absolute z-[3] w-full h-full left-0 top-0 bg-white rounded-full"
                    />
                  </AnimatePresence>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="overflow-hidden mt-2" ref={emblaThumbsRef}>
          <div className="flex flex-row gap-2">
            {images.map((image, index) => (
              <div
                key={`thumb-${index}`}
                className={`min-w-0 cursor-pointer transition-all duration-200 ${
                  index === selectedIndex
                    ? "opacity-100 ring-2 ring-orange-500"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ flex: "0 0 20%" }}
                onClick={() => onThumbClick(index)}
              >
                <img
                  src={image.src}
                  className="w-full h-20 object-contain rounded-md"
                  alt={`Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
