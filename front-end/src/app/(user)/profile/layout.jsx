import React from 'react'
import Sidebar from './sidebar/Sidebar'
import PageTitle from '../components/PageTitle'

const ProfileLayout = ({ children }) => {
  return (
    <div>
      <PageTitle title={"Profile"} path={"/profile"} pathname={"Home/Profile"}/>
    <div className="min-h-screen px-6 md:px-12 py-6">
        
      <div className="bg-[#0D0D0D] rounded-xl border border-[#B3BEBA]/30 overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="bg-[#0D0D0D]  border-r border-[#B3BEBA]/20">
          <Sidebar />
        </aside>
        <main className=" bg-[#0D0D0D]">
          {children}
        </main>
      </div>
    </div>
    </div>
  )
}

export default ProfileLayout










