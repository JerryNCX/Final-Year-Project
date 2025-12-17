import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs,TabsContent,TabsList,TabsTrigger } from '@/components/ui/tabs'

function HeaderTabs() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="Home">
            <TabsList>
                <TabsTrigger value="Home">Home</TabsTrigger>
                <TabsTrigger value="Contact">Contact</TabsTrigger>
                <TabsTrigger value="About">About</TabsTrigger>
                <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="Home">
                {/* <Homepage /> */}
            </TabsContent>
            <TabsContent value="Contact">
                {/* <ContactPage /> */}
            </TabsContent>
            <TabsContent value="About">
                {/* <AboutPage /> */}
            </TabsContent>
            <TabsContent value="Sign Up">
                {/* <SignUpPage /> */}
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default HeaderTabs