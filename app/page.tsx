import type { Metadata } from "next"
import Header from "@/components/header"
import PomodoroTimer from "@/components/pomodoro-timer"
import TaskList from "@/components/task-list"
import Achievements from "@/components/achievements"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Pomodoro Hero - Focus Better, Achieve More",
  description:
    "Boost your productivity with our Pomodoro timer. Track tasks, earn achievements, and stay focused with distraction-free mode.",
  verification: {
    google: 'Cu1t59ZR1meWcXiSLx-ehUR95h9bnC31fqm7dIehS5o',
  },
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PomodoroTimer />
            <TaskList />
          </div>
          <div className="lg:col-span-1">
            <Achievements />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
