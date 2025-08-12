import Image from "next/image"

export default function Footer() {
  return (
    <footer className="dark-green-section text-white py-16 mx-8 mb-8">
      <div className="px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 relative">
              <Image src="/placeholder-z3e4p.png" alt="Rotary Logo" fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xl">Rotary Club of Gudalur Garden City</h3>
              <p className="text-white/80 font-semibold">Service Above Self</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 font-semibold">Club ID: 12345 | RI District: 3201</p>
            <p className="text-white/80 font-semibold mt-1">Chartered: 2020</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white/80 font-semibold">© 2024 Rotary Club of Gudalur Garden City</p>
            <p className="text-white/80 font-semibold mt-1">All rights reserved</p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 font-semibold">
            Part of Rotary International - Creating positive change in communities worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
