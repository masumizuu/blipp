"use client"

import { useState, useEffect } from "react"

export function useAnimationSettings() {
  const [settings, setSettings] = useState({
    speed: 1,
    intensity: 1,
    enabled: true,
  })

  useEffect(() => {
    // Load settings on mount
    const savedSettings = localStorage.getItem("animationSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse animation settings", e)
      }
    }

    // Listen for settings changes
    const handleSettingsChange = (event) => {
      setSettings(event.detail)
    }

    window.addEventListener("animationSettingsChanged", handleSettingsChange)

    return () => {
      window.removeEventListener("animationSettingsChanged", handleSettingsChange)
    }
  }, [])

  return settings
}

