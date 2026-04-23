"use client"

import React from "react"
import Link from "next/link"
import { PlusCircle, MessageSquare, History, ChartColumn } from "lucide-react"
import useKundaliStores from "@/app/Stores/KundaliStores"

const  Sidebar = () => {
  const {KundaliDatas} = useKundaliStores()
  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-5rem)] w-64 bg-white border-r border-gray-200 z-30 flex flex-col">

      {/* TOP SECTION */}
      <div className="p-4 border-b border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-3 rounded-lg transition"
        >
          <PlusCircle size={18} />
          Create New
        </Link>
      </div>

      {/* BOTTOM SECTION */}
      <div className="flex-1 p-4 flex flex-col gap-2">

        { KundaliDatas.length>0 ?
          KundaliDatas.map((itm,idx)=>{
            return (
        <Link href={`/display/${idx+1}`} key={idx} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition">
          <ChartColumn size={18} />
          {itm?.name || "New Kundali"}
        </Link>
            )
          }):
          "No Data"

        }

        

       

      </div>

    </div>
  )
}

export default Sidebar