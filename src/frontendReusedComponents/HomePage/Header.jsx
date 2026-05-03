import React, { useState } from 'react'
import HeaderTabs from './HeaderTabs'
import SearchBar from './SearchBar'
import SearchPopover from '../Search/SearchPopover'
import { Search } from 'lucide-react'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <>
      <header className='min-h-[40px] pt-4 text-center font-bold'>
        <div className='grid grid-cols-6 gap-4 items-center'>
          <div className="col-span-2 md:col-span-1 justify-self-start text-2xl md:text-3xl font-bold">
            <a href="/" className="hover:text-blue-600 transition-colors">
              TECH ATELIER
            </a>
          </div>
          <div className="col-span-2 md:col-span-2 md:col-start-3 justify-self-center w-full md:w-auto hidden md:block">
            <HeaderTabs />
          </div>
          <div className="col-span-2 md:col-span-2 col-end-7 justify-self-end flex items-center gap-3">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500 hidden sm:inline">Search</span>
            </button>
            {/* <div className="w-full md:w-48 lg:w-64 hidden md:block">
              <SearchBar />
            </div> */}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="md:hidden px-4 py-2 border-b flex items-center gap-2">
        <button
          onClick={() => setShowSearch(true)}
          className="flex-1 flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50"
        >
          <Search className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Search products...</span>
        </button>
      </div>

      <SearchPopover
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </>
  )
}