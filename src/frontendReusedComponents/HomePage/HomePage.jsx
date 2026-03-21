import React from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import CategorySection from './CategorySection'
import FeaturedProductsSection from './FeaturedProductsSection'
import NewsletterSection from './NewsletterSection'
import Footer from './Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 lg:space-y-14">
        <Header />
        <HeroSection />
        <CategorySection />
        <FeaturedProductsSection />
        <NewsletterSection />
        <Footer />
      </div>
    </div>
  )
}

