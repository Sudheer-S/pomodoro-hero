"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, Clock, Target, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

// Import chart components
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"
import { Badge } from "@/components/ui/badge"

export default function StatsPage() {
  const [completedPomodoros] = useLocalStorage("completedPomodoros", 0)
  const [totalFocusTime] = useLocalStorage("totalFocusTime", 0)
  const [tasks] = useLocalStorage("pomodoroTasks", [])
  const [streak] = useLocalStorage("dailyStreak", 0)
  const [dailyData, setDailyData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])

  // Generate mock data for charts
  useEffect(() => {
    // Daily data - last 7 days
    const generateDailyData = () => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const today = new Date().getDay()

      return Array.from({ length: 7 }, (_, i) => {
        const dayIndex = (today - 6 + i + 7) % 7
        const dayName = days[dayIndex]
        const isToday = i === 6

        // Generate realistic data with an upward trend and today's actual count
        let count = isToday ? completedPomodoros % 10 : Math.floor(Math.random() * 8) + 1

        // Make the trend more realistic with higher values for weekdays
        if (dayIndex >= 1 && dayIndex <= 5) {
          count += 2
        }

        return {
          name: dayName,
          pomodoros: count,
          hours: ((count * 25) / 60).toFixed(1),
        }
      })
    }

    // Weekly data - last 4 weeks
    const generateWeeklyData = () => {
      return Array.from({ length: 4 }, (_, i) => {
        const weekNum = 4 - i
        return {
          name: `Week ${weekNum}`,
          pomodoros: Math.floor(Math.random() * 30) + 10 + i * 5,
          hours: (Math.random() * 10 + 5 + i * 2).toFixed(1),
        }
      })
    }

    // Monthly data - last 6 months
    const generateMonthlyData = () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const currentMonth = new Date().getMonth()

      return Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentMonth - 5 + i + 12) % 12
        const monthName = months[monthIndex]

        return {
          name: monthName,
          pomodoros: Math.floor(Math.random() * 80) + 40 + i * 15,
          hours: (Math.random() * 30 + 20 + i * 5).toFixed(1),
        }
      })
    }

    setDailyData(generateDailyData())
    setWeeklyData(generateWeeklyData())
    setMonthlyData(generateMonthlyData())
  }, [completedPomodoros])

  // Calculate stats
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const averageDailyPomodoros = completedPomodoros > 0 ? (completedPomodoros / Math.max(1, streak)).toFixed(1) : 0
  const totalHours = (totalFocusTime / 3600).toFixed(1)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Productivity Statistics</h1>
            <Badge variant="outline" className="px-3 py-1 text-sm bg-gradient-to-r from-red-500/10 to-orange-500/10">
              <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-gradient bg-gradient-to-r from-red-500 to-orange-500">Productivity Insights</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-4 border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pomodoros</p>
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    {completedPomodoros}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <Clock className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Focus Time</p>
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                    {totalHours}h
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                    {streak} days
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg p-4 border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Task Completion</p>
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-violet-500">
                    {completionRate}%
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <BarChart className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </motion.div>
          </div>

          <Card className="mb-8 border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Productivity Trends</CardTitle>
              <CardDescription>Track your focus sessions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily">
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="pomodoros" name="Pomodoros" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="hours" name="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="weekly">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="pomodoros" name="Pomodoros" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="hours" name="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="monthly">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="pomodoros" name="Pomodoros" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="hours" name="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Productivity Insights</CardTitle>
                <CardDescription>Key metrics about your focus habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">Average Daily Pomodoros</span>
                    <span className="font-medium">{averageDailyPomodoros}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">Completed Tasks</span>
                    <span className="font-medium">
                      {completedTasks} / {totalTasks}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">Average Session Length</span>
                    <span className="font-medium">25 min</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm">Most Productive Day</span>
                    <span className="font-medium">Wednesday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Longest Streak</span>
                    <span className="font-medium">{streak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Productivity Tips</CardTitle>
                <CardDescription>Suggestions to improve your focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-md">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-1">Consistency is Key</h4>
                    <p className="text-sm text-muted-foreground">
                      Try to complete at least 4 pomodoros every day to build a strong habit.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-1">Take Breaks Seriously</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your breaks to stretch, hydrate, and rest your eyes for maximum productivity.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-md">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-1">Plan Your Tasks</h4>
                    <p className="text-sm text-muted-foreground">
                      Prepare your task list before starting your first Pomodoro of the day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
