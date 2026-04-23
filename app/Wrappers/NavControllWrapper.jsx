'use client'
import React, { useEffect } from 'react'
import Sidebar from '../Components/Navbars/SideBar'
import TopBar from '../Components/Navbars/TopBar'
import useNavControl from '../Stores/UseNavControl'
import { useUser } from "@clerk/nextjs"
import { LoaderIcon } from 'lucide-react'
import useKundaliStores from '../Stores/KundaliStores'

const NavControllWrapper = (  {children}) => {
    
    const {isSidebarOpen} = useNavControl()

     const {setKundaliDatas} = useKundaliStores()

     useEffect(()=>{
      const dataString = localStorage.getItem("Kundalis")
      const data = dataString? JSON.parse(dataString):[]

      setKundaliDatas(data)
     },[])


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