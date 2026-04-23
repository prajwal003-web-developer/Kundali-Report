'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Navbars/SideBar'
import TopBar from '../Components/Navbars/TopBar'
import useNavControl from '../Stores/UseNavControl'
import { useUser } from "@clerk/nextjs"
import { LoaderIcon } from 'lucide-react'
import useKundaliStores from '../Stores/KundaliStores'

const NavControllWrapper = (  {children}) => {

  const [Loading, setLoading] = useState(true)
    
    const {isSidebarOpen} = useNavControl()

     const {setKundaliDatas} = useKundaliStores()

     useEffect(()=>{

      setTimeout(()=>{
        setLoading(false)
      },1000)
      const dataString = localStorage.getItem("Kundalis")
      const data = dataString? JSON.parse(dataString):[]

      setKundaliDatas(data)
     },[])



    if(Loading){
    return  <div className='flex justify-center items-center h-[100dvh]'>
        <LoaderIcon className='duratio-700 animate-spin' size={64}/>
      </div>
  }

  return (
    <div>
        <TopBar/>
       { isSidebarOpen &&

         <Sidebar/>
       }
        <div className={`pt-16  ${isSidebarOpen?"md:pl-64 p-2":""}`}>
            {children}
        </div>
    </div>
  )
}

export default NavControllWrapper