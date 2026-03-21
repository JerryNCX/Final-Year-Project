import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HeaderTabs() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Tabs defaultValue="Home">
        <TabsList variant="line" className="w-full justify-between">
          <TabsTrigger value="Home">Home</TabsTrigger>
          <TabsTrigger value="Contact">Contact</TabsTrigger>
          <TabsTrigger value="About">About</TabsTrigger>
          <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="Home" />
        <TabsContent value="Contact" />
        <TabsContent value="About" />
        <TabsContent value="Sign Up" />
      </Tabs>
    </div>
  )
}

