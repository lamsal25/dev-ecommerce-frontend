
import React from 'react'
import ProductSection from '../sections/productsSection'
import HeroSection from '../../components/heroSection'
import PromoBannerSection from '../sections/promoBannerSection'
import OurServicesSection from '../sections/ourServicesSection'
import ShoppingTimeBanner from '../../components/shoppingTimeBanner'
import CategoriesSection from '../sections/categorySection'
import ProductListByLocation from '../sections/productListByLocation'
import SponsoredAd from '@/components/sponsoredAd'

export default function page() {
  return (
    <div>

      <HeroSection />
      <OurServicesSection />
      <ShoppingTimeBanner />
      <CategoriesSection />
      <ProductSection />
      <ProductListByLocation location="Baneshwor" />
      <PromoBannerSection />
      <ProductListByLocation location="Makalbari" />
      <SponsoredAd />
      <ProductSection />

    </div>
  )
}
