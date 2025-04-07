"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content:
      "This chat app has completely transformed how our team communicates. The real-time messaging and intuitive interface make collaboration a breeze.",
    author: "Sarah Johnson",
    role: "Product Manager",
    avatar: "/default-avatars/Catrina.png",
  },
  {
    id: 2,
    content:
      "I've tried many messaging apps, but this one stands out with its reliability and speed. The notification system ensures I never miss important messages.",
    author: "Michael Chen",
    role: "Software Developer",
    avatar: "/default-avatars/Cowren.png",
  },
  {
    id: 3,
    content:
      "The user experience is exceptional. It's clear the developers put a lot of thought into making communication as seamless as possible.",
    author: "Emily Rodriguez",
    role: "UX Designer",
    avatar: "/default-avatars/Koalby.png",
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-muted dark:bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Don't just take our word for it
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 md:p-12 rounded-lg shadow-lg"
            >
              <Quote className="h-12 w-12 text-primary/20 mb-6" />

              <p className="text-lg md:text-xl text-foreground mb-8">"{testimonials[currentIndex].content}"</p>

              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].author}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonials[currentIndex].author}</h4>
                  <p className="text-foreground/80">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-primary" : "bg-foreground/30"}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-card p-2 rounded-full shadow-md hover:bg-muted transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-foreground/80" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-card p-2 rounded-full shadow-md hover:bg-muted transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-foreground/80" />
          </button>
        </div>
      </div>
    </section>
  )
}

