"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { supabase, type BoardMember } from "@/lib/supabase"



// BoardMemberCard component
const BoardMemberCard: React.FC<{ member: BoardMember }> = ({ member }) => {
  return (
    <div
      className="flex-shrink-0 w-64 sm:w-72 modern-card p-5 sm:p-6 text-center cursor-pointer hover:shadow-xl transition-shadow duration-300
                 bg-transparent rounded-lg shadow-md flex flex-col items-center justify-center"
    >
      <p className="text-emerald-600 font-bold text-base sm:text-lg mb-1">{member.designation}</p>
      <h3 className="font-montserrat font-bold text-lg sm:text-xl text-gray-900">{member.name}</h3>
    </div>
  );
};

export default function BoardMembers() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBoardMembers()
  }, [])

  const fetchBoardMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('board_members')
        .select('id, designation, name')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBoardMembers(data || [])
    } catch (error) {
      console.error('Error fetching board members:', error)
      setBoardMembers([])
    } finally {
      setLoading(false)
    }
  }

  // Split members into groups for display
  const chunkSize = Math.ceil(boardMembers.length / 3)
  const layer1Members = boardMembers.slice(0, chunkSize)
  const layer2Members = boardMembers.slice(chunkSize, chunkSize * 2)
  const layer3Members = boardMembers.slice(chunkSize * 2)

  // Duplicate members for seamless looping
  const duplicatedLayer1Members = [...layer1Members, ...layer1Members, ...layer1Members];
  const duplicatedLayer2Members = [...layer2Members, ...layer2Members, ...layer2Members];
  const duplicatedLayer3Members = [...layer3Members, ...layer3Members, ...layer3Members];

  // Effect to handle auto-scrolling for each row
  useEffect(() => {
    const setupScrolling = (ref: React.RefObject<HTMLDivElement>, direction: 'normal' | 'reverse', speed: string) => {
      const scrollElement = ref.current;
      if (!scrollElement) return;

      // Reset animation to ensure it restarts correctly on prop changes or re-renders
      scrollElement.style.animation = 'none';
      void scrollElement.offsetWidth; // Trigger reflow
      scrollElement.style.animation = '';

      scrollElement.style.animationDuration = speed;
      scrollElement.style.animationDirection = direction; // Use 'normal' or 'reverse' directly
      scrollElement.style.animationPlayState = 'running'; // Ensure it's running by default
    };

    // Row 1: Scrolls Left (normal direction for animate-scroll-right)
    setupScrolling(scrollRef1, 'normal', '140s');
    // Row 2: Scrolls Right (reverse direction for animate-scroll-right)
    setupScrolling(scrollRef2, 'reverse', '180s');
    // Row 3: Scrolls Left (normal direction for animate-scroll-right)
    setupScrolling(scrollRef3, 'normal', '160s');

    // Cleanup function to pause animations when component unmounts
    return () => {
      if (scrollRef1.current) scrollRef1.current.style.animationPlayState = 'paused';
      if (scrollRef2.current) scrollRef2.current.style.animationPlayState = 'paused';
      if (scrollRef3.current) scrollRef3.current.style.animationPlayState = 'paused';
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <section
      id="board"
      className="py-20"
      style={{
        backgroundImage: 'url("/Our_Board_Members_bg.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.8, // Adjust for subtlety
      }}
    >
      <div className="px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="grand-title font-montserrat font-black text-6xl mb-6 text-emerald-900">Our Board Members</h2>
          <p className="text-emerald-800 max-w-3xl mx-auto text-xl font-medium">
            Meet the dedicated leaders who guide our club's mission and initiatives
          </p>
        </div>

        {/* Rotary Strip Banner */}
        <div className="my-8">
          <Image
            src="/rotary-strip-banner.png"
            alt="Rotary Strip Banner"
            width={800}
            height={60}
            className="w-3/4 mx-auto object-cover"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-emerald-700">Loading board members...</p>
          </div>
        ) : boardMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-emerald-700">No board members found.</p>
          </div>
        ) : null}

        {/* Auto-scrolling for both Desktop and Mobile with Fade Effects */}
        <div className="scroll-fade-container overflow-hidden py-4">
          {/* Row 1: Scrolls Left */}
          <div
            ref={scrollRef1}
            className="flex gap-5 animate-scroll-right" // Custom animation for left scroll
            style={{ width: "fit-content" }}
          >
            {duplicatedLayer1Members.map((member, index) => (
              <BoardMemberCard key={`row1-${index}`} member={member} />
            ))}
          </div>

          {/* Row 2: Scrolls Right */}
          <div className="py-8"> {/* Add some vertical spacing */}
            <div
              ref={scrollRef2}
              className="flex gap-5 animate-scroll-right" // Existing animation for right scroll
              style={{ width: "fit-content" }}
            >
              {duplicatedLayer2Members.map((member, index) => (
                <BoardMemberCard key={`row2-${index}`} member={member} />
              ))}
            </div>
          </div>

          {/* Row 3: Scrolls Left */}
          <div
            ref={scrollRef3}
            className="flex gap-5 animate-scroll-right" // Custom animation for left scroll
            style={{ width: "fit-content" }}
          >
            {duplicatedLayer3Members.map((member, index) => (
              <BoardMemberCard key={`row3-${index}`} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


