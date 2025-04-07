"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const stats = [
  { value: 10000, label: "Active Users", suffix: "+" },
  { value: 5000000, label: "Messages Sent", suffix: "+" },
  { value: 99.9, label: "Uptime", suffix: "%" },
  { value: 4.8, label: "User Rating", suffix: "/5" },
]

export default function StatisticsSection() {
  return (
    <section className="py-20 bg-background dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            By the Numbers
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our platform is trusted by users worldwide
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, index }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = Number.parseInt(stat.value.toString().substring(0, 3))

    // If the stat value is less than 100, don't abbreviate
    if (stat.value < 100) {
      start = 0
    }

    // if start is different than end, animate
    if (start !== end) {
      const timer = setTimeout(() => {
        setCount(count + 1)
      }, 20)

      // If we've reached the end value, clear the timer
      if (count === end) {
        clearTimeout(timer)
      }

      return () => clearTimeout(timer)
    }
  }, [count, stat.value])

  // Format large numbers
  const formatValue = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M"
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K"
    } else {
      return value.toString()
    }
  }

  return (
    <motion.div
      className="bg-muted p-6 rounded-lg text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="text-4xl font-bold text-primary mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
      >
        {stat.value < 100 ? stat.value : formatValue(stat.value)}
        {stat.suffix}
      </motion.div>
      <p className="text-foreground/80">{stat.label}</p>
    </motion.div>
  )
}

