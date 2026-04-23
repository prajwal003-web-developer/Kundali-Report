"use client"

import React from "react"
import { SignInButton } from "@clerk/nextjs"
import { Sparkles, UserPlus, LogIn } from "lucide-react"

const SignedOutBox = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-4">

      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="text-green-400" />
        <h1 className="text-3xl font-bold tracking-wide">
          AstroTalk
        </h1>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-center max-w-md mb-8">
        Create your personalized Kundali, explore astrological insights, and chat with AI to get guidance about your future.
      </p>

      {/* Card */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4">

        {/* Sign Up */}
        <SignInButton mode="modal">
          <button className="w-full py-3 bg-green-500 hover:bg-green-600 transition-all duration-200 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Sign Up
          </button>
        </SignInButton>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <div className="flex-1 h-[1px] bg-gray-600"></div>
          OR
          <div className="flex-1 h-[1px] bg-gray-600"></div>
        </div>

        {/* Sign In */}
        <SignInButton mode="modal">
          <button className="w-full py-3 border border-green-400 hover:bg-green-500 hover:text-white transition-all duration-200 font-semibold rounded-lg flex items-center justify-center gap-2">
            <LogIn size={18} />
            Sign In
          </button>
        </SignInButton>


      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-6 text-center">
        Generate Kundali charts • AI-powered astrology • Personalized insights
      </p>

    </div>
  )
}

export default SignedOutBox