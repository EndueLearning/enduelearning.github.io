"use client"

import { useState, useEffect, useRef } from "react"

export default function InteractiveClock() {
  const [hour, setHour] = useState(3)
  const [minute, setMinute] = useState(30)
  const [isDragging, setIsDragging] = useState<"hour" | "minute" | null>(null)
  const clockRef = useRef<HTMLDivElement>(null)

  // Handle mouse/touch events for clock hands
  const handleMouseDown = (hand: "hour" | "minute") => {
    setIsDragging(hand)
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !clockRef.current) return

    // Get clock center and pointer position
    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Get pointer coordinates
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    // Calculate angle
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90
    const normalizedAngle = (angle + 360) % 360

    if (isDragging === "hour") {
      // Convert angle to hour (0-11)
      const newHour = Math.round(normalizedAngle / 30) % 12
      setHour(newHour === 0 ? 12 : newHour)
    } else {
      // Convert angle to minute (0-59)
      const newMinute = Math.round(normalizedAngle / 6) % 60
      setMinute(newMinute)
    }
  }

  useEffect(() => {
    // Add event listeners
    const handleMove = (e: MouseEvent | TouchEvent) => handleMouseMove(e)
    const handleUp = () => handleMouseUp()
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseup", handleUp)
    window.addEventListener("touchmove", handleMove)
    window.addEventListener("touchend", handleUp)

    return () => {
      // Remove event listeners
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleUp)
      window.removeEventListener("touchmove", handleMove)
      window.removeEventListener("touchend", handleUp)
    }
  }, [])

  // Calculate hand angles
  const hourAngle = (hour % 12) * 30 + minute * 0.5
  const minuteAngle = minute * 6

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-around">
      <div ref={clockRef} className="relative w-64 h-64 rounded-full bg-white border-8 border-purple-600 shadow-lg">
        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = ((i + 1) * 30 * Math.PI) / 180
          const x = 110 * Math.sin(angle)
          const y = -110 * Math.cos(angle)
          return (
            <div
              key={i}
              className="absolute font-bold text-xl text-purple-800"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                left: "calc(50% - 10px)",
                top: "calc(50% - 10px)",
              }}
            >
              {i + 1}
            </div>
          )
        })}

        {/* Hour hand */}
        <div
          className="absolute w-1.5 h-16 bg-black rounded-full origin-bottom cursor-pointer z-10"
          style={{
            transform: `translateX(-50%) rotate(${hourAngle}deg)`,
            left: "50%",
            bottom: "50%",
          }}
          onMouseDown={() => handleMouseDown("hour")}
          onTouchStart={() => handleMouseDown("hour")}
        />

        {/* Minute hand */}
        <div
          className="absolute w-1 h-24 bg-black rounded-full origin-bottom cursor-pointer z-10"
          style={{
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
            left: "50%",
            bottom: "50%",
          }}
          onMouseDown={() => handleMouseDown("minute")}
          onTouchStart={() => handleMouseDown("minute")}
        />

        {/* Center dot */}
        <div
          className="absolute w-4 h-4 bg-black rounded-full"
          style={{ left: "calc(50% - 8px)", top: "calc(50% - 8px)" }}
        />
      </div>

      <div className="text-center md:text-left">
        <div className="text-4xl font-bold mb-4 text-purple-800">
          {hour.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}
        </div>
        <p className="text-gray-600 mb-4">Drag the clock hands to change the time</p>
        <div className="flex gap-4 justify-center md:justify-start">
          <button
            onClick={() => setHour(hour === 12 ? 1 : hour + 1)}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-800 transition-colors"
          >
            Hour +
          </button>
          <button
            onClick={() => setMinute((minute + 5) % 60)}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-800 transition-colors"
          >
            Min +5
          </button>
        </div>
      </div>
    </div>
  )
}

