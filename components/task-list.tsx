"use client"

import type React from "react"

import { useState, useRef, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit, Check, X, Clock, ArrowUp, ArrowDown } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import ErrorBoundary from "@/components/error-boundary"

interface Task {
  id: string
  title: string
  completed: boolean
  pomodorosCompleted: number
  createdAt: number
  priority: "high" | "medium" | "low"
  estimatedPomodoros: number
}

function TaskListComponent() {
  const [tasks = [], setTasks] = useLocalStorage<Task[]>("pomodoroTasks", [])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState("")
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const newTaskInputRef = useRef<HTMLInputElement>(null)

  // Add new task
  const addTask = useCallback(() => {
    if (newTaskTitle.trim() === "") return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      pomodorosCompleted: 0,
      createdAt: Date.now(),
      priority,
      estimatedPomodoros,
    }

    setTasks((prevTasks) => [...(prevTasks || []), newTask])
    setNewTaskTitle("")
    setEstimatedPomodoros(1)
    setPriority("medium")
    newTaskInputRef.current?.focus()
  }, [newTaskTitle, priority, estimatedPomodoros, setTasks])

  // Toggle task completion
  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      setTasks((prevTasks) =>
        (prevTasks || []).map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
      )
    },
    [setTasks],
  )

  // Delete task
  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prevTasks) => (prevTasks || []).filter((task) => task.id !== taskId))
    },
    [setTasks],
  )

  // Start editing task
  const startEditingTask = useCallback((task: Task) => {
    setEditingTaskId(task.id)
    setEditingTaskTitle(task.title)
    setEstimatedPomodoros(task.estimatedPomodoros)
    setPriority(task.priority)
  }, [])

  // Save edited task
  const saveEditedTask = useCallback(() => {
    if (editingTaskId && editingTaskTitle.trim() !== "") {
      setTasks((prevTasks) =>
        (prevTasks || []).map((task) =>
          task.id === editingTaskId ? { ...task, title: editingTaskTitle, estimatedPomodoros, priority } : task,
        ),
      )
    }

    setEditingTaskId(null)
    setEditingTaskTitle("")
  }, [editingTaskId, editingTaskTitle, estimatedPomodoros, priority, setTasks])

  // Cancel editing task
  const cancelEditingTask = useCallback(() => {
    setEditingTaskId(null)
    setEditingTaskTitle("")
  }, [])

  // Increment pomodoros completed for a task
  const incrementPomodorosCompleted = useCallback(
    (taskId: string) => {
      setTasks((prevTasks) =>
        (prevTasks || []).map((task) =>
          task.id === taskId ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 } : task,
        ),
      )
    },
    [setTasks],
  )

  // Change task priority
  const changeTaskPriority = useCallback(
    (taskId: string, newPriority: "high" | "medium" | "low") => {
      setTasks((prevTasks) =>
        (prevTasks || []).map((task) => (task.id === taskId ? { ...task, priority: newPriority } : task)),
      )
    },
    [setTasks],
  )

  // Handle Enter key press in new task input
  const handleNewTaskKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        addTask()
      }
    },
    [addTask],
  )

  // Handle Enter key press in edit task input
  const handleEditTaskKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        saveEditedTask()
      } else if (e.key === "Escape") {
        cancelEditingTask()
      }
    },
    [saveEditedTask, cancelEditingTask],
  )

  // Get filtered tasks
  const getFilteredTasks = useCallback(() => {
    if (!tasks || !Array.isArray(tasks)) return []

    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed)
      case "completed":
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }, [tasks, filter])

  // Sort tasks by priority and completion status
  const sortedTasks = getFilteredTasks().sort((a, b) => {
    // Completed tasks go to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  // Get priority badge color
  const getPriorityColor = useCallback((priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }, [])

  return (
    <ErrorBoundary>
      <Card className="border border-border/50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="text-xs h-8"
              >
                All
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
                className="text-xs h-8"
              >
                Active
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
                className="text-xs h-8"
              >
                Completed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleNewTaskKeyDown}
                ref={newTaskInputRef}
                className="border-dashed focus-visible:ring-offset-2"
                aria-label="New task title"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0" aria-label="Set estimated pomodoros">
                  <Clock className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Estimated Pomodoros</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[1, 2, 3, 4, 5].map((num) => (
                  <DropdownMenuItem
                    key={num}
                    onClick={() => setEstimatedPomodoros(num)}
                    className={estimatedPomodoros === num ? "bg-muted" : ""}
                  >
                    {num} {num === 1 ? "pomodoro" : "pomodoros"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "shrink-0",
                    priority === "high" && "border-red-500 text-red-500",
                    priority === "medium" && "border-yellow-500 text-yellow-500",
                    priority === "low" && "border-blue-500 text-blue-500",
                  )}
                  aria-label="Set task priority"
                >
                  {priority === "high" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : priority === "low" ? (
                    <ArrowDown className="h-4 w-4" />
                  ) : (
                    <ArrowUp className="h-4 w-4 opacity-50" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPriority("high")} className={priority === "high" ? "bg-muted" : ""}>
                  <ArrowUp className="h-4 w-4 mr-2 text-red-500" />
                  High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setPriority("medium")}
                  className={priority === "medium" ? "bg-muted" : ""}
                >
                  <ArrowUp className="h-4 w-4 mr-2 text-yellow-500 opacity-50" />
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriority("low")} className={priority === "low" ? "bg-muted" : ""}>
                  <ArrowDown className="h-4 w-4 mr-2 text-blue-500" />
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={addTask}
              disabled={newTaskTitle.trim() === ""}
              className="shrink-0 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              aria-label="Add task"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="mb-2 text-4xl">🎯</div>
                <p>No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {sortedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-center justify-between p-3 border rounded-md transition-colors",
                      task.completed ? "bg-muted/50" : "hover:bg-muted/30",
                      task.priority === "high" && !task.completed && "border-l-4 border-l-red-500",
                      task.priority === "medium" && !task.completed && "border-l-4 border-l-yellow-500",
                      task.priority === "low" && !task.completed && "border-l-4 border-l-blue-500",
                    )}
                  >
                    {editingTaskId === task.id ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <Input
                          value={editingTaskTitle}
                          onChange={(e) => setEditingTaskTitle(e.target.value)}
                          onKeyDown={handleEditTaskKeyDown}
                          autoFocus
                          className="flex-1"
                          aria-label="Edit task title"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                              aria-label="Set estimated pomodoros"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Estimated Pomodoros</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[1, 2, 3, 4, 5].map((num) => (
                              <DropdownMenuItem
                                key={num}
                                onClick={() => setEstimatedPomodoros(num)}
                                className={estimatedPomodoros === num ? "bg-muted" : ""}
                              >
                                {num} {num === 1 ? "pomodoro" : "pomodoros"}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className={cn(
                                "shrink-0",
                                priority === "high" && "border-red-500 text-red-500",
                                priority === "medium" && "border-yellow-500 text-yellow-500",
                                priority === "low" && "border-blue-500 text-blue-500",
                              )}
                              aria-label="Set task priority"
                            >
                              {priority === "high" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : priority === "low" ? (
                                <ArrowDown className="h-4 w-4" />
                              ) : (
                                <ArrowUp className="h-4 w-4 opacity-50" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Priority</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setPriority("high")}
                              className={priority === "high" ? "bg-muted" : ""}
                            >
                              <ArrowUp className="h-4 w-4 mr-2 text-red-500" />
                              High
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setPriority("medium")}
                              className={priority === "medium" ? "bg-muted" : ""}
                            >
                              <ArrowUp className="h-4 w-4 mr-2 text-yellow-500 opacity-50" />
                              Medium
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setPriority("low")}
                              className={priority === "low" ? "bg-muted" : ""}
                            >
                              <ArrowDown className="h-4 w-4 mr-2 text-blue-500" />
                              Low
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="icon" variant="ghost" onClick={saveEditedTask} aria-label="Save task">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEditingTask} aria-label="Cancel editing">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            aria-label={`Mark task "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
                          />
                          <div className="flex flex-col">
                            <label
                              htmlFor={`task-${task.id}`}
                              className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.title}
                            </label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                                {task.pomodorosCompleted}/{task.estimatedPomodoros} 🍅
                              </Badge>
                              <Badge className={`text-xs px-1 py-0 h-5 ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditingTask(task)}
                            aria-label={`Edit task "${task.title}"`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteTask(task.id)}
                            aria-label={`Delete task "${task.title}"`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TaskListComponent)
