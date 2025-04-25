"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useLocalStorage } from "@/hooks/use-local-storage"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface TimerSettings {
  pomodoro: number
  shortBreak: number
  longBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
}

export default function SettingsPage() {
  // Default timer settings
  const defaultSettings: TimerSettings = {
    pomodoro: 25 * 60, // 25 minutes in seconds
    shortBreak: 5 * 60, // 5 minutes in seconds
    longBreak: 15 * 60, // 15 minutes in seconds
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
  }

  // Get settings from localStorage or use defaults
  const [settings, setSettings] = useLocalStorage<TimerSettings>("pomodoroSettings", defaultSettings)

  // Local state for form inputs
  const [pomodoroMinutes, setPomodoroMinutes] = useState(Math.floor(settings.pomodoro / 60))
  const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(settings.shortBreak / 60))
  const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(settings.longBreak / 60))
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.autoStartBreaks)
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(settings.autoStartPomodoros)
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled)

  // Update local state when settings change
  useEffect(() => {
    setPomodoroMinutes(Math.floor(settings.pomodoro / 60))
    setShortBreakMinutes(Math.floor(settings.shortBreak / 60))
    setLongBreakMinutes(Math.floor(settings.longBreak / 60))
    setAutoStartBreaks(settings.autoStartBreaks)
    setAutoStartPomodoros(settings.autoStartPomodoros)
    setSoundEnabled(settings.soundEnabled)
  }, [settings])

  // Save settings
  const saveSettings = () => {
    setSettings({
      pomodoro: pomodoroMinutes * 60,
      shortBreak: shortBreakMinutes * 60,
      longBreak: longBreakMinutes * 60,
      autoStartBreaks,
      autoStartPomodoros,
      soundEnabled,
    })
  }

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  // Clear all data
  const clearAllData = () => {
    if (
      window.confirm("Are you sure you want to clear all data? This will reset all settings, tasks, and achievements.")
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>Customize your Pomodoro timer durations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pomodoro-duration">Pomodoro Duration: {pomodoroMinutes} minutes</Label>
                  <Slider
                    id="pomodoro-duration"
                    min={1}
                    max={60}
                    step={1}
                    value={[pomodoroMinutes]}
                    onValueChange={(value) => setPomodoroMinutes(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="short-break-duration">Short Break Duration: {shortBreakMinutes} minutes</Label>
                  <Slider
                    id="short-break-duration"
                    min={1}
                    max={30}
                    step={1}
                    value={[shortBreakMinutes]}
                    onValueChange={(value) => setShortBreakMinutes(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="long-break-duration">Long Break Duration: {longBreakMinutes} minutes</Label>
                  <Slider
                    id="long-break-duration"
                    min={1}
                    max={60}
                    step={1}
                    value={[longBreakMinutes]}
                    onValueChange={(value) => setLongBreakMinutes(value[0])}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Behavior Settings</CardTitle>
              <CardDescription>Customize how the Pomodoro timer behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start-breaks">Auto-start Breaks</Label>
                  <p className="text-sm text-muted-foreground">Automatically start break timer when a Pomodoro ends</p>
                </div>
                <Switch id="auto-start-breaks" checked={autoStartBreaks} onCheckedChange={setAutoStartBreaks} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start-pomodoros">Auto-start Pomodoros</Label>
                  <p className="text-sm text-muted-foreground">Automatically start Pomodoro timer when a break ends</p>
                </div>
                <Switch
                  id="auto-start-pomodoros"
                  checked={autoStartPomodoros}
                  onCheckedChange={setAutoStartPomodoros}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-enabled">Sound Notifications</Label>
                  <p className="text-sm text-muted-foreground">Play a sound when a timer ends</p>
                </div>
                <Switch id="sound-enabled" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your app data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <Button variant="destructive" onClick={clearAllData}>
                  Clear All Data
                </Button>
                <p className="text-sm text-muted-foreground">This will reset all settings, tasks, and achievements</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={saveSettings}>Save Settings</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
