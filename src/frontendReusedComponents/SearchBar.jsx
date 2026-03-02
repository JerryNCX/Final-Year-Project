import React from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search } from 'lucide-react'

const SearchBar = () => {
  return (
    <div>
          <InputGroup className="">
            <InputGroupInput placeholder="Search ..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
          </InputGroup>
        </div>
  )
}

export default SearchBar