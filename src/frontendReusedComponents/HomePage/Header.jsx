import React from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import HeaderTabs from './HeaderTabs'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header>
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[120px] pt-4 text-center font-bold"
      >
        <ResizablePanel defaultSize={25}>
          <div className="bg-black text-white text-xs sm:text-sm md:text-base py-1 sm:py-2 justify-center items-center">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={75}
          className="flex flex-col md:flex-row h-full items-start md:items-center justify-between gap-4 md:gap-6 lg:gap-10"
        >
          <div>
            <span className="text-2xl md:text-3xl font-bold">Tech &amp; Comp</span>
          </div>
          <div className="w-full md:w-auto">
            <HeaderTabs />
          </div>
          <div className="w-full md:w-64 lg:w-80">
            <SearchBar />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </header>
  )
}

