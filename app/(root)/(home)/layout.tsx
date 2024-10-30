import NavBar from '@/components/ui/NavBar'
import Sidebar from '@/components/ui/Sidebar'
import React, { ReactNode } from 'react'

const HomeLayout = ({ children }: {children: ReactNode}) => {
  return (
    <main className='relative'>
        <NavBar/>
        <div className='flex'>
            <Sidebar />
            <section className='flex min-h-screen flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
                <div className='w-full'>
                    {children}
                </div>
            </section>
        </div>
    </main>
  )
}

export default HomeLayout