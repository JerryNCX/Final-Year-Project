import React from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Search products..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  )
}

