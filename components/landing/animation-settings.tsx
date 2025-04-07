"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AnimationSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    speed: 1,
    intensity: 1,
    enabled: true,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("animationSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse animation settings", error)
      }
    }
  }, [])

  // Save settings
  useEffect(() => {
    localStorage.setItem("animationSettings", JSON.stringify(settings))
    // Dispatch a custom event so other components can react to settings changes
    window.dispatchEvent(new CustomEvent("animationSettingsChanged", { detail: settings }))
  }, [settings])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Animation settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Settings panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="absolute bottom-16 right-0 bg-card p-4 rounded-lg shadow-xl w-64"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Animation Settings</h3>
            <button onClick={() => setIsOpen(false)} className="text-foreground/60 hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="animations-enabled">Animations</Label>
                <Switch
                  id="animations-enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                />
              </div>
              <p className="text-xs text-foreground/60">Enable or disable all animations</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animation-speed">Animation Speed</Label>
              <Slider
                id="animation-speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[settings.speed]}
                onValueChange={(value) => setSettings({ ...settings, speed: value[0] })}
                disabled={!settings.enabled}
              />
              <div className="flex justify-between text-xs text-foreground/60">
                <span>Slower</span>
                <span>Normal</span>
                <span>Faster</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animation-intensity">Animation Intensity</Label>
              <Slider
                id="animation-intensity"
                min={0.5}
                max={1.5}
                step={0.1}
                value={[settings.intensity]}
                onValueChange={(value) => setSettings({ ...settings, intensity: value[0] })}
                disabled={!settings.enabled}
              />
              <div className="flex justify-between text-xs text-foreground/60">
                <span>Subtle</span>
                <span>Normal</span>
                <span>Intense</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

