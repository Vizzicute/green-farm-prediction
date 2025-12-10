import React, { ReactNode } from 'react'
import Navbar from './_components/navbar'

const PublicLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='min-h-screen'>
      <Navbar/>
      <div>{children}</div>
    </div>
  )
}

export default PublicLayout
