"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Coffee, Bell } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { getRandomQuote } from "@/lib/quotes"
import { requestNotificationPermission, sendNotification } from "@/utils/notifications"
import ErrorBoundary from "@/components/error-boundary"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

interface TimerSettings {
  pomodoro: number
  shortBreak: number
  longBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
  ambientSoundEnabled: boolean
  notificationsEnabled: boolean
}

export default function PomodoroTimer() {
  // Default timer settings
  const defaultSettings: TimerSettings = {
    pomodoro: 25 * 60, // 25 minutes in seconds
    shortBreak: 5 * 60, // 5 minutes in seconds
    longBreak: 15 * 60, // 15 minutes in seconds
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    ambientSoundEnabled: false,
    notificationsEnabled: false,
  }

  // Get settings from localStorage or use defaults
  const [settings, setSettings] = useLocalStorage<TimerSettings>("pomodoroSettings", defaultSettings)

  // Timer state
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro)
  const [isActive, setIsActive] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useLocalStorage("completedPomodoros", 0)
  const [totalFocusTime, setTotalFocusTime] = useLocalStorage("totalFocusTime", 0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote())
  const [showQuote, setShowQuote] = useState(false)
  const [notificationsPermission, setNotificationsPermission] = useState<boolean>(false)
  const { toast } = useToast()

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsPermission(Notification.permission === "granted")
    }
  }, [])

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        audioRef.current = new Audio("/notification.mp3")
        ambientAudioRef.current = new Audio("/ambient-coffee.mp3")
        if (ambientAudioRef.current) {
          ambientAudioRef.current.loop = true
          ambientAudioRef.current.volume = 0.3
        }
      } catch (error) {
        console.error("Error initializing audio:", error)
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (ambientAudioRef.current) {
        try {
          ambientAudioRef.current.pause()
          ambientAudioRef.current.src = ""
        } catch (error) {
          console.error("Error cleaning up audio:", error)
        }
      }
    }
  }, [])

  // Handle ambient sound
  useEffect(() => {
    if (!ambientAudioRef.current) return

    try {
      if (settings.ambientSoundEnabled && isActive && mode === "pomodoro") {
        ambientAudioRef.current.play().catch((e) => console.error("Error playing ambient sound:", e))
      } else {
        ambientAudioRef.current.pause()
      }
    } catch (error) {
      console.error("Error handling ambient sound:", error)
    }
  }, [settings.ambientSoundEnabled, isActive, mode])

  // Handle mode change
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsActive(false)

    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro)
        setShowQuote(false)
        break
      case "shortBreak":
        setTimeLeft(settings.shortBreak)
        setCurrentQuote(getRandomQuote())
        setShowQuote(true)
        if (settings.autoStartBreaks) startTimer()
        break
      case "longBreak":
        setTimeLeft(settings.longBreak)
        setCurrentQuote(getRandomQuote())
        setShowQuote(true)
        if (settings.autoStartBreaks) startTimer()
        break
    }

    startTimeRef.current = null
    pausedTimeRef.current = 0
  }, [mode, settings])

  // Update document title with timer
  useEffect(() => {
    if (typeof document !== "undefined") {
      const formattedTime = formatTime(timeLeft)
      const modeText = mode === "pomodoro" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"
      document.title = `${formattedTime} - ${modeText} | Pomodoro Hero`
    }

    return () => {
      if (typeof document !== "undefined") {
        document.title = "Pomodoro Hero - Focus Better, Achieve More"
      }
    }
  }, [timeLeft, mode])

  // Timer logic
  useEffect(() => {
    if (!isActive) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsActive(false)

          // Play sound if enabled
          if (settings.soundEnabled && audioRef.current) {
            try {
              audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
            } catch (error) {
              console.error("Error playing notification sound:", error)
            }
          }

          // Send notification if enabled
          if (settings.notificationsEnabled && notificationsPermission) {
            if (mode === "pomodoro") {
              sendNotification("Pomodoro Completed!", {
                body: "Great job! Time for a break.",
                icon: "/favicon.ico",
              })
            } else {
              sendNotification("Break Completed!", {
                body: "Ready to focus again?",
                icon: "/favicon.ico",
              })
            }
          }

          // Handle timer completion
          if (mode === "pomodoro") {
            // Update stats
            setCompletedPomodoros((prev) => prev + 1)
            setTotalFocusTime((prev) => prev + settings.pomodoro)

            // Show toast notification
            toast({
              title: "Pomodoro completed!",
              description: "Great job! Time for a break.",
              variant: "default",
            })

            // Auto start break
            const pomodoroCount = completedPomodoros + 1
            if (pomodoroCount % 4 === 0) {
              setMode("longBreak")
            } else {
              setMode("shortBreak")
            }
          } else {
            // Show toast notification
            toast({
              title: "Break completed!",
              description: "Ready to focus again?",
              variant: "default",
            })

            // Auto start next pomodoro
            if (settings.autoStartPomodoros) {
              setMode("pomodoro")
            }
          }

          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [
    isActive,
    mode,
    settings,
    completedPomodoros,
    setCompletedPomodoros,
    setTotalFocusTime,
    toast,
    notificationsPermission,
  ])

  // Start timer function
  const startTimer = useCallback(() => {
    if (!isActive) {
      setIsActive(true)
      startTimeRef.current = Date.now() - pausedTimeRef.current
    }
  }, [isActive])

  // Pause timer function
  const pauseTimer = useCallback(() => {
    if (isActive) {
      setIsActive(false)
      pausedTimeRef.current = Date.now() - (startTimeRef.current || 0)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive])

  // Reset timer function
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsActive(false)

    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro)
        break
      case "shortBreak":
        setTimeLeft(settings.shortBreak)
        break
      case "longBreak":
        setTimeLeft(settings.longBreak)
        break
    }

    startTimeRef.current = null
    pausedTimeRef.current = 0
  }, [mode, settings])

  // Toggle sound function
  const toggleSound = useCallback(() => {
    setSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    })
  }, [settings, setSettings])

  // Toggle ambient sound function
  const toggleAmbientSound = useCallback(() => {
    setSettings({
      ...settings,
      ambientSoundEnabled: !settings.ambientSoundEnabled,
    })
  }, [settings, setSettings])

  // Toggle notifications function
  const toggleNotifications = useCallback(async () => {
    if (!settings.notificationsEnabled) {
      const permission = await requestNotificationPermission()
      setNotificationsPermission(permission)
      if (permission) {
        setSettings({
          ...settings,
          notificationsEnabled: true,
        })
        toast({
          title: "Notifications enabled",
          description: "You'll receive notifications when timers complete.",
          variant: "default",
        })
      } else {
        toast({
          title: "Notification permission denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        })
      }
    } else {
      setSettings({
        ...settings,
        notificationsEnabled: false,
      })
    }
  }, [settings, setSettings, toast])

  // Format time function
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Calculate progress percentage
  const calculateProgress = useCallback((): number => {
    let total = 0
    switch (mode) {
      case "pomodoro":
        total = settings.pomodoro
        break
      case "shortBreak":
        total = settings.shortBreak
        break
      case "longBreak":
        total = settings.longBreak
        break
    }

    const progress = ((total - timeLeft) / total) * 100
    return progress
  }, [mode, settings, timeLeft])

  // Toggle fullscreen function
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        })
      }
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Calculate circle properties
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const progress = calculateProgress()
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <ErrorBoundary>
      <Card
        ref={containerRef}
        className={cn(
          "mb-8 transition-all duration-300 overflow-hidden",
          isFullscreen ? "fixed inset-0 z-50 rounded-none" : "",
        )}
      >
        <CardContent
          className={cn(
            "flex flex-col items-center justify-center p-6",
            isFullscreen ? "h-screen" : "",
            mode === "pomodoro"
              ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
              : "",
            mode === "shortBreak"
              ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
              : "",
            mode === "longBreak"
              ? "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
              : "",
          )}
        >
          <Tabs
            defaultValue="pomodoro"
            className="w-full max-w-md"
            value={mode}
            onValueChange={(value) => setMode(value as TimerMode)}
          >
            <TabsList className="grid grid-cols-3 mb-8 p-1 bg-background/80 backdrop-blur-sm">
              <TabsTrigger
                value="pomodoro"
                className="rounded-full data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/30"
              >
                Focus
              </TabsTrigger>
              <TabsTrigger
                value="shortBreak"
                className="rounded-full data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30"
              >
                Short Break
              </TabsTrigger>
              <TabsTrigger
                value="longBreak"
                className="rounded-full data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30"
              >
                Long Break
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <svg width="280" height="280" className="transform -rotate-90" aria-hidden="true">
                      {/* Background circle */}
                      <circle
                        cx="140"
                        cy="140"
                        r={radius}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeWidth="12"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="140"
                        cy="140"
                        r={radius}
                        stroke={`url(#${mode}Gradient)`}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />

                      {/* Define gradients for each mode */}
                      <defs>
                        <linearGradient id="pomodoroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                        <linearGradient id="shortBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      <motion.span
                        key={timeLeft}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-6xl font-bold tabular-nums"
                      >
                        {formatTime(timeLeft)}
                      </motion.span>
                    </div>
                  </div>

                  {showQuote && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mt-6 mb-4 text-center max-w-xs"
                    >
                      <p className="text-sm italic text-muted-foreground">"{currentQuote.text}"</p>
                      <p className="text-xs mt-1 text-muted-foreground">— {currentQuote.author}</p>
                    </motion.div>
                  )}

                  <div className="flex space-x-4 mt-8">
                    <Button
                      size="lg"
                      onClick={isActive ? pauseTimer : startTimer}
                      className={`w-32 transition-all duration-300 ${
                        mode === "pomodoro"
                          ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                          : mode === "shortBreak"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      }`}
                      aria-label={isActive ? "Pause timer" : "Start timer"}
                    >
                      {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                      {isActive ? "Pause" : "Start"}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetTimer}
                      disabled={
                        (mode === "pomodoro" && timeLeft === settings.pomodoro && !isActive) ||
                        (mode === "shortBreak" && timeLeft === settings.shortBreak && !isActive) ||
                        (mode === "longBreak" && timeLeft === settings.longBreak && !isActive)
                      }
                      className="border-current"
                      aria-label="Reset timer"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reset
                    </Button>
                  </div>

                  <div className="flex justify-between w-full max-w-xs mt-6">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSound}
                        aria-label={settings.soundEnabled ? "Mute sound" : "Enable sound"}
                        title={settings.soundEnabled ? "Mute" : "Unmute"}
                        className="rounded-full"
                      >
                        {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleAmbientSound}
                        aria-label={settings.ambientSoundEnabled ? "Turn off ambient sound" : "Turn on ambient sound"}
                        title={settings.ambientSoundEnabled ? "Turn off ambient sound" : "Turn on ambient sound"}
                        className={`rounded-full ${settings.ambientSoundEnabled ? "text-primary" : ""}`}
                      >
                        <Coffee className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleNotifications}
                        aria-label={settings.notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                        title={settings.notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                        className={`rounded-full ${settings.notificationsEnabled ? "text-primary" : ""}`}
                      >
                        <Bell className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        className="rounded-full"
                      >
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                      </Button>
                    </div>

                    <Badge variant="outline" className="flex items-center gap-1 px-3">
                      <span className="text-sm font-medium">{completedPomodoros}</span>
                      <span className="text-xs text-muted-foreground">completed</span>
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
