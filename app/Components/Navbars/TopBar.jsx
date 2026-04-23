"use client"

import React from "react"
import Link from "next/link"

import { Menu, X } from "lucide-react"
import useNavControl from "@/app/Stores/UseNavControl"

const TopBar = () => {

const {isSidebarOpen, toggleSidebar} = useNavControl()


  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-white z-30 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="text-xl font-semibold tracking-wide text-gray-900">
            ASTRO TALK
          </span>
        </Link>

        {/* Hamburger */}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 transition">
        { !isSidebarOpen
             ? <Menu size={22} className="text-gray-700" /> :
                <X size={22} className="text-gray-700" />
        }
        </button>

      </div>

  
    </div>
  )
}

export default TopBar