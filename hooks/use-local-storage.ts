"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Create a ref to track if the component is mounted
  const isMounted = useRef(false)

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      if (typeof window === "undefined") {
        return initialValue
      }

      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      if (!item) {
        return initialValue
      }

      try {
        return JSON.parse(item)
      } catch {
        console.error(`Error parsing localStorage key "${key}":`, item)
        return initialValue
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  // Only run this effect once after the initial render on the client
  useEffect(() => {
    if (typeof window === "undefined") return

    if (!isMounted.current) {
      isMounted.current = true

      // This ensures we sync with localStorage if it changes in another tab/window
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key && e.newValue !== null) {
          try {
            setStoredValue(JSON.parse(e.newValue))
          } catch (error) {
            console.error(`Error parsing localStorage change for key "${key}":`, error)
          }
        }
      }

      window.addEventListener("storage", handleStorageChange)
      return () => window.removeEventListener("storage", handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue]
}
