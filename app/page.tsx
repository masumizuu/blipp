import Link from "next/link"
import { Button } from "@/components/ui/button"
import LandingHero from "@/components/landing/hero"
import FeatureSection from "@/components/landing/feature-section"
import TestimonialSection from "@/components/landing/testimonial-section"
import StatisticsSection from "@/components/landing/statistics-section"
import Footer from "@/components/landing/footer"
import AnimationSettings from "@/components/landing/animation-settings"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <LandingHero />

      {/* Feature Section */}
      <FeatureSection />

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start chatting?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users already connecting through our platform. Sign up today and experience seamless
            communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-primary font-semibold">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Animation Settings */}
      <AnimationSettings />
    </div>
  )
}

