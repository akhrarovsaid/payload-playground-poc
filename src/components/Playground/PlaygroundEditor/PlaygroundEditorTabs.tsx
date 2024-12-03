import { LucideFileJson, LucideX } from "lucide-react"

import { cn } from "@/utilities/cn"

type Props = {
  isActive?: boolean
}

export const PlaygroundTab = ({
  isActive = false
}: Props) => {

  return (
    <button className={cn('group h-full flex flex-col bg-base-1000', { 'bg-base-900 z-[2]': isActive })}>
      <span className="h-full flex items-center px-3">

        <span className={cn('flex items-center text-base-300', { 'text-base-150': isActive })}>
          <LucideFileJson className="h-4 leading-none" />
          <p className='leading-none'>Filename.tsx</p>
          <LucideX className={cn('h-4 leading-none text-base-250 opacity-0 group-hover:opacity-100', { 'opacity-100': isActive })} />
        </span>

      </span>
    </button>
  )
}

export const PlaygroundEditorTabs = () => (
  <header className='sticky top-0 w-full h-10 flex flex-shrink-0 bg-base-1000 z-10 isolate'>
    <PlaygroundTab isActive />
    <PlaygroundTab />
    <hr className="border-base-750 bottom-0 mt-auto w-full h-px flex-shrink-0 absolute z-[1]" />
  </header>
)

