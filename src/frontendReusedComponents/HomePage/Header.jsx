import React from 'react'
import HeaderTabs from './HeaderTabs'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className='min-h-[40px] pt-4 text-center font-bold'>
       <div className='grid grid-cols-6 gap-4'>
          {/* <div className="col-span-6 bg-black text-white text-xs sm:text-sm md:text-base py-1 sm:py-2 justify-center items-center">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          </div> */}
          <div className="col-span-2 col-start-1 justify-self-start text-2xl md:text-3xl font-bold">
            <span>TECH ATELIER</span>
          </div>
          <div className="col-span-2 col-start-3 justify-self-center w-full md:w-auto">
            <HeaderTabs />
          </div>
          <div className="col-span-2 col-end-7 justify-self-end w-full md:w-64 lg:w-80">
            <SearchBar />
          </div>
       </div>
    </header>
  )
}

