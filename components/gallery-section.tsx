"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { supabase, type GalleryImage } from "@/lib/supabase"

export default function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [topRowPaused, setTopRowPaused] = useState(false)
  const [bottomRowPaused, setBottomRowPaused] = useState(false)
  const [topRowDragging, setTopRowDragging] = useState(false)
  const [bottomRowDragging, setBottomRowDragging] = useState(false)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)
  const topStartXRef = useRef(0)
  const bottomStartXRef = useRef(0)
  const topScrollLeftRef = useRef(0)
  const bottomScrollLeftRef = useRef(0)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching gallery images:", error)
      setGalleryImages([
        {
          id: 1,
          image_url: "/community-service.png",
          caption: "Community Service Project - Helping local families with essential supplies and support",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          image_url: "/weekly-club-meeting.png",
          caption: "Weekly Club Meeting - Planning our next community initiatives",
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          image_url: "/annual-charity-fundraiser.png",
          caption: "Annual Charity Fundraiser - Raising funds for local education programs",
          created_at: new Date().toISOString(),
        },
        {
          id: 4,
          image_url: "/youth-development.png",
          caption: "Youth Development Program - Mentoring the next generation of leaders",
          created_at: new Date().toISOString(),
        },
        {
          id: 5,
          image_url: "/environmental-initiative.png",
          caption: "Environmental Initiative - Protecting our natural resources for future generations",
          created_at: new Date().toISOString(),
        },
        {
          id: 6,
          image_url: "/community-health-camp.png",
          caption: "Health Camp Initiative - Providing free medical checkups to underserved communities",
          created_at: new Date().toISOString(),
        },
        {
          id: 7,
          image_url: "/tree-plantation.png",
          caption: "Tree Plantation Drive - Creating a greener future for Gudalur",
          created_at: new Date().toISOString(),
        },
        {
          id: 8,
          image_url: "/scholarship-ceremony.png",
          caption: "Scholarship Distribution - Supporting education for deserving students",
          created_at: new Date().toISOString(),
        },
      ])
    } else {
      setGalleryImages(data || [])
    }
  }

  // Split images into two rows
  const topRowImages = galleryImages.slice(0, Math.ceil(galleryImages.length / 2))
  const bottomRowImages = galleryImages.slice(Math.ceil(galleryImages.length / 2))

  // Create duplicated arrays for seamless loop
  const duplicatedTopRow = [...topRowImages, ...topRowImages, ...topRowImages]
  const duplicatedBottomRow = [...bottomRowImages, ...bottomRowImages, ...bottomRowImages]

  // Top Row Handlers
  const handleTopRowMouseEnter = () => {
    if (!topRowDragging) {
      setTopRowPaused(true)
      if (topRowRef.current) {
        topRowRef.current.style.animationPlayState = "paused"
      }
    }
  }

  const handleTopRowMouseLeave = () => {
    if (!topRowDragging) {
      setTopRowPaused(false)
      if (topRowRef.current) {
        topRowRef.current.style.animationPlayState = "running"
      }
    }
  }

  const handleTopRowDragStart = (clientX: number) => {
    setTopRowPaused(true)
    setTopRowDragging(true)
    if (topRowRef.current) {
      topRowRef.current.style.animationPlayState = "paused"
      topStartXRef.current = clientX - topRowRef.current.offsetLeft
      topScrollLeftRef.current = topRowRef.current.scrollLeft
    }
  }

  const handleTopRowDragMove = (clientX: number) => {
    if (!topRowDragging || !topRowRef.current) return
    const x = clientX - topRowRef.current.offsetLeft
    const walk = (x - topStartXRef.current) * 2
    topRowRef.current.scrollLeft = topScrollLeftRef.current - walk
  }

  const handleTopRowDragEnd = () => {
    setTopRowDragging(false)
  }

  // Bottom Row Handlers
  const handleBottomRowMouseEnter = () => {
    if (!bottomRowDragging) {
      setBottomRowPaused(true)
      if (bottomRowRef.current) {
        bottomRowRef.current.style.animationPlayState = "paused"
      }
    }
  }

  const handleBottomRowMouseLeave = () => {
    if (!bottomRowDragging) {
      setBottomRowPaused(false)
      if (bottomRowRef.current) {
        bottomRowRef.current.style.animationPlayState = "running"
      }
    }
  }

  const handleBottomRowDragStart = (clientX: number) => {
    setBottomRowPaused(true)
    setBottomRowDragging(true)
    if (bottomRowRef.current) {
      bottomRowRef.current.style.animationPlayState = "paused"
      bottomStartXRef.current = clientX - bottomRowRef.current.offsetLeft
      bottomScrollLeftRef.current = bottomRowRef.current.scrollLeft
    }
  }

  const handleBottomRowDragMove = (clientX: number) => {
    if (!bottomRowDragging || !bottomRowRef.current) return
    const x = clientX - bottomRowRef.current.offsetLeft
    const walk = (x - bottomStartXRef.current) * 2
    bottomRowRef.current.scrollLeft = bottomScrollLeftRef.current - walk
  }

  const handleBottomRowDragEnd = () => {
    setBottomRowDragging(false)
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="grand-title font-montserrat font-black text-6xl mb-6">Gallery</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl font-medium">
            Moments from our service projects and community activities
          </p>
        </div>

        {/* Two-Layer Auto-scrolling Gallery with Fade Effects */}
        <div className="space-y-6 overflow-hidden">
          {/* Top Row - Scrolls Left to Right */}
          <div className="scroll-fade-container bg-gray overflow-hidden">
            <div
              ref={topRowRef}
              className={`flex gap-6 animate-scroll-right ${topRowPaused ? (topRowDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
              style={{
                animationDuration: "50s",
                width: "fit-content",
                animationPlayState: topRowPaused ? "paused" : "running",
              }}
              onMouseEnter={handleTopRowMouseEnter}
              onMouseLeave={handleTopRowMouseLeave}
              onMouseDown={(e) => handleTopRowDragStart(e.pageX)}
              onMouseMove={(e) => handleTopRowDragMove(e.pageX)}
              onMouseUp={handleTopRowDragEnd}
              onTouchStart={(e) => {
                e.preventDefault()
                handleTopRowDragStart(e.touches[0].clientX)
              }}
              onTouchMove={(e) => {
                e.preventDefault()
                handleTopRowDragMove(e.touches[0].clientX)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                handleTopRowDragEnd()
              }}
            >
              {duplicatedTopRow.map((image, index) => (
                <div
                  key={`top-${image.id}-${index}`}
                  className="flex-shrink-0 w-80 modern-card overflow-hidden cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => {
                    if (!topRowDragging) {
                      setSelectedImage(image)
                    }
                  }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={image.image_url || "/placeholder.svg?height=224&width=320"}
                      alt={image.caption || "Gallery image"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-semibold">Click to view full image</p>
                    </div>
                  </div>
                  {image.caption && (
                    <div className="p-5">
                      <p className="text-gray-700 font-semibold line-clamp-2 text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Scrolls Right to Left */}
          <div className="scroll-fade-container bg-gray overflow-hidden">
            <div
              ref={bottomRowRef}
              className={`flex gap-6 animate-scroll-left ${bottomRowPaused ? (bottomRowDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
              style={{
                animationDuration: "45s",
                width: "fit-content",
                animationPlayState: bottomRowPaused ? "paused" : "running",
              }}
              onMouseEnter={handleBottomRowMouseEnter}
              onMouseLeave={handleBottomRowMouseLeave}
              onMouseDown={(e) => handleBottomRowDragStart(e.pageX)}
              onMouseMove={(e) => handleBottomRowDragMove(e.pageX)}
              onMouseUp={handleBottomRowDragEnd}
              onTouchStart={(e) => {
                e.preventDefault()
                handleBottomRowDragStart(e.touches[0].clientX)
              }}
              onTouchMove={(e) => {
                e.preventDefault()
                handleBottomRowDragMove(e.touches[0].clientX)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                handleBottomRowDragEnd()
              }}
            >
              {duplicatedBottomRow.map((image, index) => (
                <div
                  key={`bottom-${image.id}-${index}`}
                  className="flex-shrink-0 w-80 modern-card overflow-hidden cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => {
                    if (!bottomRowDragging) {
                      setSelectedImage(image)
                    }
                  }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={image.image_url || "/placeholder.svg?height=224&width=320"}
                      alt={image.caption || "Gallery image"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-semibold">Click to view full image</p>
                    </div>
                  </div>
                  {image.caption && (
                    <div className="p-5">
                      <p className="text-gray-700 font-semibold line-clamp-2 text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox Modal with Title and Description */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedImage(null)}
          >
            <div className="modern-card max-w-5xl max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="relative h-96">
                  <Image
                    src={selectedImage.image_url || "/placeholder.svg"}
                    alt={selectedImage.caption || "Gallery image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">
                    {selectedImage.caption?.split(" - ")[0] || "Gallery Image"}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {selectedImage.caption || "A moment from our community service activities."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
