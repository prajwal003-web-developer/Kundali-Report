import React from 'react'
import SignedOutBox from '../Components/SignedOut'
import { auth, currentUser } from '@clerk/nextjs/server'

const ClerkWrapperManual = async ({children}) => {

const { isAuthenticated } = await auth()
  return (
    <div>
      {isAuthenticated?children:<SignedOutBox/>}
    </div>
  )
}

export default ClerkWrapperManual