import React from 'react'
import NavControllWrapper from '../Wrappers/NavControllWrapper'



const layout = ( {children}) => {
  return (
    <div>
       <NavControllWrapper>
        {children}
       </NavControllWrapper>
    </div>
  )
}

export default layout