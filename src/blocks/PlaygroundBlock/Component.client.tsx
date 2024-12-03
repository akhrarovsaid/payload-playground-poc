'use client'

import { Playground } from "@/components/Playground"
import { PlaygroundProvider } from "@/providers/Playground"

export const PlaygroundBlockClient: React.FC = () => {

  return (
    <PlaygroundProvider>
      <Playground />
    </PlaygroundProvider> 
  )
}

{/* <PlaygroundProvider>
  <Playground />
</PlaygroundProvider> */}
