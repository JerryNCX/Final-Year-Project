import React from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'

export default function NewsletterSection() {
  return (
    <section className="py-6 border rounded-2xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2 max-w-xl">
        <h2 className="text-lg sm:text-xl font-semibold">Stay updated with the latest drops</h2>
        <p className="text-sm text-muted-foreground">
          Subscribe to our newsletter to receive exclusive offers, early access to sales, and curated
          tech recommendations.
        </p>
      </div>
      <div className="w-full max-w-md">
        <InputGroup>
          <InputGroupInput type="email" placeholder="Enter your email" />
          <InputGroupAddon>
            <Button size="sm">Subscribe</Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </section>
  )
}

