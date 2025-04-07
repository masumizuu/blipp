"use client"

import { motion } from "framer-motion"
import { MessageSquare, Shield, Bell, Zap, Users, Smartphone } from "lucide-react"

const features = [
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Real-time Messaging",
    description: "Send and receive messages instantly with our lightning-fast messaging system.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Secure Communication",
    description: "Your conversations are protected with end-to-end encryption for maximum privacy.",
  },
  {
    icon: <Bell className="h-10 w-10 text-primary" />,
    title: "Smart Notifications",
    description: "Get notified about new messages and never miss an important conversation.",
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Fast & Reliable",
    description: "Built with modern technology to ensure speed and reliability at all times.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "User Profiles",
    description: "Customize your profile with images and personal information.",
  },
  {
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    title: "Mobile Friendly",
    description: "Access your conversations from any device with our responsive design.",
  },
]

export default function FeatureSection() {
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
            Powerful Features
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need for seamless communication in one place
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

