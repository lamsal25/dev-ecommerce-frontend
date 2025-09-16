'use client'

import Image from "next/image"
import { useEffect, useState, useRef, useCallback } from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import API from "@/lib/api"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"

type SponsoredAd = {
    id: number
    title: string
    image: string
    link: string
    description: string
    ctaText?: string
}

export default function SponsoredAdCarousel() {
    const [ads, setAds] = useState<SponsoredAd[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const containerRef = useRef<HTMLElement>(null)
    const isVisible = useIntersectionObserver(containerRef)
    const autoplayInterval = useRef<NodeJS.Timeout | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    const [sliderRef, sliderInstance] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: { 
            perView: 1, 
            spacing: 16
        },
        mode: "snap",
        renderMode: "performance",
        drag: true,
        created: (instance) => {
            instance.container.addEventListener('mouseenter', pauseAutoplay)
            instance.container.addEventListener('mouseleave', resumeAutoplay)
        },
        destroyed: (instance) => {
            instance.container.removeEventListener('mouseenter', pauseAutoplay)
            instance.container.removeEventListener('mouseleave', resumeAutoplay)
        },
        slideChanged: (instance) => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            
            const animate = () => {
                instance.container.style.scrollBehavior = 'smooth'
                animationFrameRef.current = null
            }
            
            animationFrameRef.current = requestAnimationFrame(animate)
        },
        breakpoints: {
            "(min-width: 768px)": {
                slides: { perView: 1, spacing: 24 },
            },
        },
    })

    // Pause autoplay on hover
    const pauseAutoplay = useCallback(() => {
        if (autoplayInterval.current) {
            clearInterval(autoplayInterval.current)
            autoplayInterval.current = null
        }
    }, [])

    // Resume autoplay when mouse leaves
    const resumeAutoplay = useCallback(() => {
        if (isVisible && !autoplayInterval.current) {
            startAutoplay()
        }
    }, [isVisible])

    // Start autoplay with smooth transitions
    const startAutoplay = useCallback(() => {
        if (!sliderInstance.current) return

        autoplayInterval.current = setInterval(() => {
            sliderInstance.current?.next()
        }, 5000)
    }, [sliderInstance])

    // Handle autoplay when visible
    useEffect(() => {
        if (!sliderInstance.current) return

        pauseAutoplay()

        if (isVisible) {
            startAutoplay()
        }

        return () => {
            pauseAutoplay()
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isVisible, sliderInstance, pauseAutoplay, startAutoplay])

    // Fetch ads
    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true)
            try {
                const res = await API.get("advertisements/getAdsByPosition/footer/")
                setAds(res.data)
            } catch (err) {
                console.error("Failed to fetch sponsored ads", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAds()
    }, [])

    // Loading state
    if (isLoading) {
        return (
            <section className="w-full bg-primary py-16 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-full bg-gray-400/30 rounded-lg mb-6"></div>
                        <div className="h-8 w-64 bg-gray-400/30 rounded-lg mb-8"></div>
                        <div className="h-10 w-32 bg-gray-400/30 rounded-full"></div>
                    </div>
                </div>
            </section>
        )
    }

    // Default content when no ads available
    const defaultAd = {
        title: "Enhance Your Music Experience",
        description: "Discover premium audio equipment that brings your music to life with crystal clear sound quality and immersive bass.",
        image: "/headphone.png", // Replace with your default image path
        link: "/products",
        ctaText: "Shop Now"
    }

    // Empty state with attractive default content
    if (!ads.length && !isLoading) {
        return (
            <section 
                className="w-full bg-primary py-12 px-4 sm:px-6 relative overflow-hidden"
                ref={containerRef}
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full filter blur-xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Content */}
                    <div className="flex flex-col gap-6 max-w-xl text-center lg:text-left">
                        <span className="text-sm font-medium text-blue-300 tracking-wider">
                            PREMIUM SPONSORED CONTENT
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                            {defaultAd.title}
                        </h2>
                        <p className="text-blue-100/90 text-lg leading-relaxed">
                            {defaultAd.description}
                        </p>
                        <div className="mt-4">
                            <a
                                href={defaultAd.link}
                                className="inline-block bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                            >
                                {defaultAd.ctaText}
                            </a>
                        </div>
                    </div>
                    
                    {/* Default Image */}
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex-shrink-0 group">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-3xl transform rotate-6 scale-95 group-hover:rotate-3 group-hover:scale-100 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-blue-500/5 rounded-3xl transform -rotate-6 scale-95 group-hover:-rotate-3 group-hover:scale-100 transition-all duration-500"></div>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="bg-blue-600/20 rounded-3xl w-full h-full flex items-center justify-center">
                                <svg className="w-1/2 h-1/2 text-blue-400/30" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section
            ref={containerRef}
            className="w-full bg-primary py-12 px-4 sm:px-6 relative overflow-hidden container m-auto"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full filter blur-xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div ref={sliderRef} className="keen-slider">
                    {ads.map((ad) => (
                        <div 
                            key={ad.id} 
                            className="keen-slider__slide flex flex-col-reverse lg:flex-row items-center justify-between gap-8 px-4 py-6"
                        >
                            {/* Content */}
                            <div className="flex flex-col gap-6 max-w-xl z-10">
                                <span className="text-sm font-medium text-secondary tracking-wider">
                                    SPONSORED CONTENT
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                                    {ad.title}
                                </h2>
                                <p className="text-blue-100/90 text-lg leading-relaxed text-center lg:text-left">
                                    {ad.description}
                                </p>
                                <div className="mt-4 flex justify-center lg:justify-start">
                                    <a
                                        href={ad.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-secondary hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                                    >
                                        {'Visit Now'}
                                    </a>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex-shrink-0 group">
                                <div className="absolute inset-0 bg-secondary/10 rounded-3xl transform rotate-6 scale-95 group-hover:rotate-3 group-hover:scale-100 transition-all duration-500"></div>
                                <div className="absolute inset-0 bg-gray-400/15 rounded-3xl transform -rotate-6 scale-95 group-hover:-rotate-3 group-hover:scale-100 transition-all duration-500"></div>
                                <div className="relative w-full h-full">
                                    <Image
                                        src={ad.image}
                                        alt={ad.title}
                                        fill
                                        sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                                        className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                                        priority={false}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Dots */}
                {ads.length > 1 && (
                    <div className="flex justify-center mt-8 gap-2">
                        {ads.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => sliderInstance.current?.moveToIdx(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${sliderInstance.current?.track.details.rel === idx ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}