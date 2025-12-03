import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React from 'react'
import HeaderTabs from './HeaderTabs'

function Header() {
  return (
    <>
      <ResizablePanelGroup direction="vertical" className="min-h-[120px] pt-4 text-center font-bold">
        <ResizablePanel defaultSize={25}>
      <div>
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
      </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75} className="flex flex-row h-full items-center justify-center max--[1560px]">
        <div className="">
          <span className="text-3xl pt-6 pb-6">Tech & Comp</span>
        </div>
        <div className="p-6">
          <HeaderTabs className="align-self-center" />
        </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default Header