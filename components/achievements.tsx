"use client"

import { useEffect, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Clock, Calendar, FlameIcon as Fire, Star, Target, Zap } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"
import ErrorBoundary from "@/components/error-boundary"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
  unlockedAt?: number
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

const defaultAchievements: Achievement[] = [
  {
    id: "first-pomodoro",
    title: "First Focus",
    description: "Complete your first Pomodoro session",
    icon: "trophy",
    unlocked: false,
    progress: 0,
    target: 1,
    rarity: "common",
  },
  {
    id: "five-pomodoros",
    title: "Focus Apprentice",
    description: "Complete 5 Pomodoro sessions",
    icon: "trophy",
    unlocked: false,
    progress: 0,
    target: 5,
    rarity: "common",
  },
  {
    id: "twenty-five-pomodoros",
    title: "Focus Master",
    description: "Complete 25 Pomodoro sessions",
    icon: "trophy",
    unlocked: false,
    progress: 0,
    target: 25,
    rarity: "uncommon",
  },
  {
    id: "one-hundred-pomodoros",
    title: "Pomodoro Champion",
    description: "Complete 100 Pomodoro sessions",
    icon: "star",
    unlocked: false,
    progress: 0,
    target: 100,
    rarity: "rare",
  },
  {
    id: "one-hour",
    title: "Hour of Power",
    description: "Accumulate 1 hour of focus time",
    icon: "clock",
    unlocked: false,
    progress: 0,
    target: 3600, // 1 hour in seconds
    rarity: "common",
  },
  {
    id: "five-hours",
    title: "Deep Worker",
    description: "Accumulate 5 hours of focus time",
    icon: "clock",
    unlocked: false,
    progress: 0,
    target: 18000, // 5 hours in seconds
    rarity: "uncommon",
  },
  {
    id: "twenty-hours",
    title: "Focus Virtuoso",
    description: "Accumulate 20 hours of focus time",
    icon: "zap",
    unlocked: false,
    progress: 0,
    target: 72000, // 20 hours in seconds
    rarity: "rare",
  },
  {
    id: "streak-3",
    title: "Consistency is Key",
    description: "Complete at least one Pomodoro for 3 days in a row",
    icon: "calendar",
    unlocked: false,
    progress: 0,
    target: 3,
    rarity: "common",
  },
  {
    id: "streak-7",
    title: "Weekly Warrior",
    description: "Complete at least one Pomodoro for 7 days in a row",
    icon: "fire",
    unlocked: false,
    progress: 0,
    target: 7,
    rarity: "uncommon",
  },
  {
    id: "streak-30",
    title: "Unstoppable",
    description: "Complete at least one Pomodoro for 30 days in a row",
    icon: "target",
    unlocked: false,
    progress: 0,
    target: 30,
    rarity: "legendary",
  },
]

function AchievementsComponent() {
  const [completedPomodoros = 0] = useLocalStorage("completedPomodoros", 0)
  const [totalFocusTime = 0] = useLocalStorage("totalFocusTime", 0) // in seconds
  const { toast } = useToast()
  const [achievements = [], setAchievements] = useLocalStorage<Achievement[]>("achievements", defaultAchievements)

  const [streak = 0, setStreak] = useLocalStorage("dailyStreak", 0)
  const [lastActiveDate = "", setLastActiveDate] = useLocalStorage("lastActiveDate", "")

  // Memoize the update function to prevent unnecessary re-renders
  const updateAchievements = useCallback(() => {
    if (!achievements || !Array.isArray(achievements)) {
      setAchievements(defaultAchievements)
      return
    }

    const updatedAchievements = achievements.map((achievement) => {
      let progress = achievement.progress
      let unlocked = achievement.unlocked

      // Update progress based on achievement type
      if (
        achievement.id === "first-pomodoro" ||
        achievement.id === "five-pomodoros" ||
        achievement.id === "twenty-five-pomodoros" ||
        achievement.id === "one-hundred-pomodoros"
      ) {
        progress = completedPomodoros
      } else if (
        achievement.id === "one-hour" ||
        achievement.id === "five-hours" ||
        achievement.id === "twenty-hours"
      ) {
        progress = totalFocusTime
      } else if (achievement.id === "streak-3" || achievement.id === "streak-7" || achievement.id === "streak-30") {
        progress = streak
      }

      // Check if achievement should be unlocked
      if (!unlocked && progress >= achievement.target) {
        unlocked = true

        // Show toast notification
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement.title} - ${achievement.description}`,
          variant: "default",
        })

        // Trigger confetti for rare and legendary achievements
        if (typeof window !== "undefined" && (achievement.rarity === "rare" || achievement.rarity === "legendary")) {
          try {
            confetti({
              particleCount: achievement.rarity === "legendary" ? 200 : 100,
              spread: 70,
              origin: { y: 0.6 },
            })
          } catch (error) {
            console.error("Error triggering confetti:", error)
          }
        }

        return {
          ...achievement,
          progress,
          unlocked,
          unlockedAt: Date.now(),
        }
      }

      return {
        ...achievement,
        progress,
      }
    })

    // Only update if there are actual changes
    if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
      setAchievements(updatedAchievements)
    }
  }, [achievements, completedPomodoros, totalFocusTime, streak, setAchievements, toast])

  // Update achievements based on stats
  useEffect(() => {
    updateAchievements()
  }, [updateAchievements])

  // Update streak
  useEffect(() => {
    if (completedPomodoros <= 0) return

    const today = new Date().toLocaleDateString()

    if (lastActiveDate === "") {
      // First time using the app
      setStreak(1)
      setLastActiveDate(today)
    } else if (lastActiveDate !== today) {
      try {
        const lastDate = new Date(lastActiveDate)
        const currentDate = new Date(today)

        // Check if the last active date was yesterday
        const timeDiff = currentDate.getTime() - lastDate.getTime()
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24))

        if (dayDiff === 1) {
          // Consecutive day, increase streak
          setStreak((prev) => prev + 1)
        } else if (dayDiff > 1) {
          // Streak broken
          setStreak(1)
        }

        setLastActiveDate(today)
      } catch (error) {
        console.error("Error updating streak:", error)
        // Reset to safe values
        setStreak(1)
        setLastActiveDate(today)
      }
    }
  }, [completedPomodoros, lastActiveDate, setLastActiveDate, setStreak])

  // Render icon based on type
  const renderIcon = useCallback((iconType: string) => {
    switch (iconType) {
      case "trophy":
        return <Trophy className="h-5 w-5" />
      case "clock":
        return <Clock className="h-5 w-5" />
      case "calendar":
        return <Calendar className="h-5 w-5" />
      case "fire":
        return <Fire className="h-5 w-5" />
      case "star":
        return <Star className="h-5 w-5" />
      case "target":
        return <Target className="h-5 w-5" />
      case "zap":
        return <Zap className="h-5 w-5" />
      default:
        return <Trophy className="h-5 w-5" />
    }
  }, [])

  // Format time from seconds to hours and minutes
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }, [])

  // Get rarity color
  const getRarityColor = useCallback((rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-500"
      case "uncommon":
        return "from-green-400 to-green-500"
      case "rare":
        return "from-blue-400 to-blue-500"
      case "epic":
        return "from-purple-400 to-purple-500"
      case "legendary":
        return "from-yellow-400 to-yellow-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }, [])

  return (
    <ErrorBoundary>
      <Card className="border border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center justify-center p-4 border rounded-md bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
              >
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                  {completedPomodoros}
                </div>
                <div className="text-sm text-muted-foreground">Pomodoros</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center justify-center p-4 border rounded-md bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
              >
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                  {formatTime(totalFocusTime)}
                </div>
                <div className="text-sm text-muted-foreground">Focus Time</div>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center justify-between p-4 border rounded-md bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20"
            >
              <div className="flex items-center">
                <Fire className="h-5 w-5 mr-2 text-orange-500" />
                <span>Current Streak</span>
              </div>
              <div className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
                {streak} days
              </div>
            </motion.div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                Badges & Achievements
              </h3>
              <div className="space-y-3">
                {achievements && Array.isArray(achievements) && achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-md transition-all",
                        achievement.unlocked ? "bg-muted/30" : "",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            achievement.unlocked
                              ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white`
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {renderIcon(achievement.icon)}
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {achievement.title}
                            {achievement.rarity !== "common" && (
                              <span
                                className={cn(
                                  "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                                  achievement.rarity === "uncommon" &&
                                    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                                  achievement.rarity === "rare" &&
                                    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                                  achievement.rarity === "epic" &&
                                    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                                  achievement.rarity === "legendary" &&
                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                                )}
                              >
                                {achievement.rarity}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                      <div className="text-sm flex flex-col items-end">
                        {achievement.unlocked ? (
                          <span className="text-primary">Unlocked</span>
                        ) : (
                          <span>
                            {achievement.progress}/{achievement.target}
                          </span>
                        )}
                        {!achievement.unlocked && (
                          <Progress
                            value={(achievement.progress / achievement.target) * 100}
                            className="h-1.5 w-20 mt-1"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No achievements available. Start your first Pomodoro!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AchievementsComponent)
