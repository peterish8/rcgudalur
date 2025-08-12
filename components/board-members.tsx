"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { supabase, type BoardMember } from "@/lib/supabase"

export default function BoardMembers() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  useEffect(() => {
    fetchBoardMembers()
  }, [])

  const fetchBoardMembers = async () => {
    const { data, error } = await supabase.from("board_members").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching board members:", error)
      setBoardMembers([
        {
          id: 1,
          name: "Rtn. Rajesh Kumar",
          position: "President",
          year: "2023-24",
          image_url: "/professional-person-portrait.png",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Rtn. Priya Sharma",
          position: "Vice President",
          year: "2023-24",
          image_url: "/professional-person-portrait.png",
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Rtn. Anil Gupta",
          position: "Secretary",
          year: "2023-24",
          image_url: "/professional-person-portrait.png",
          created_at: new Date().toISOString(),
        },
        {
          id: 4,
          name: "Rtn. Meera Patel",
          position: "Treasurer",
          year: "2023-24",
          image_url: "/professional-person-portrait.png",
          created_at: new Date().toISOString(),
        },
        {
          id: 5,
          name: "Rtn. Suresh Reddy",
          position: "Club Service Director",
          year: "2023-24",
          image_url: "/professional-person-portrait.png",
          created_at: new Date().toISOString(),
        },
        {
          id: 6,
          name: "Rtn. Kavitha Nair",
          position: "Community Service Director",
          year: "2023-24",
          image_url: "/professional-person-portrait.png",
          created_at: new Date().toISOString(),
        },
      ])
    } else {
      setBoardMembers(data || [])
    }
  }

  // Create duplicated members for seamless loop
  const duplicatedMembers = [...boardMembers, ...boardMembers, ...boardMembers]

  const handleInteractionStart = (clientX: number) => {
    setIsPaused(true)
    setIsDragging(true)
    if (scrollRef.current) {
      // Pause animation using animationPlayState
      scrollRef.current.style.animationPlayState = "paused"
      startXRef.current = clientX - scrollRef.current.offsetLeft
      scrollLeftRef.current = scrollRef.current.scrollLeft
    }
  }

  const handleInteractionMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return
    const x = clientX - scrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 2
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleInteractionEnd = () => {
    setIsDragging(false)
  }

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsPaused(true)
      if (scrollRef.current) {
        // Pause animation at current position
        scrollRef.current.style.animationPlayState = "paused"
      }
    }
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsPaused(false)
      if (scrollRef.current) {
        // Resume animation from current position
        scrollRef.current.style.animationPlayState = "running"
      }
    }
  }

  return (
    <section id="board" className="py-20 bg-white">
      <div className="px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="grand-title font-montserrat font-black text-6xl mb-6">Our Board Members</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl font-medium">
            Meet the dedicated leaders who guide our club's mission and initiatives
          </p>
        </div>

        {/* Auto-scrolling for both Desktop and Mobile with Fade Effects */}
        <div className="scroll-fade-container bg-white overflow-hidden">
          <div
            ref={scrollRef}
            className={`flex gap-5 animate-scroll-right ${isPaused ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
            style={{
              animationDuration: "35s",
              width: "fit-content",
              animationPlayState: isPaused ? "paused" : "running",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={(e) => handleInteractionStart(e.pageX)}
            onMouseMove={(e) => handleInteractionMove(e.pageX)}
            onMouseUp={handleInteractionEnd}
            onTouchStart={(e) => {
              e.preventDefault()
              handleInteractionStart(e.touches[0].clientX)
            }}
            onTouchMove={(e) => {
              e.preventDefault()
              handleInteractionMove(e.touches[0].clientX)
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              handleInteractionEnd()
            }}
          >
            {duplicatedMembers.map((member, index) => (
              <div
                key={`${member.id}-${index}`}
                className="flex-shrink-0 w-64 sm:w-72 modern-card p-5 sm:p-6 text-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={(e) => {
                  if (!isDragging) {
                    console.log("Member clicked:", member.name)
                  }
                }}
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 sm:mb-5 relative overflow-hidden rounded-full border-4 border-emerald-200">
                  <Image
                    src={member.image_url || "/professional-person-portrait.png"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-montserrat font-bold text-lg sm:text-xl text-gray-900 mb-2">{member.name}</h3>
                <p className="text-emerald-600 font-bold text-base sm:text-lg mb-1">{member.position}</p>
                <p className="text-gray-500 font-semibold text-sm">{member.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
