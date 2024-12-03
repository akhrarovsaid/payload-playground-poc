import { LoadingOverlay } from "@payloadcms/ui/elements/Loading"
import { LucideArrowLeft, LucideArrowRight, LucideRefreshCw } from "lucide-react"

import { cn } from "@/utilities/cn"
import { usePlayground } from "@/providers/Playground"

export const PlaygroundViewport = ({ loading }: { loading: boolean }) => {
  const { viewport, reloadViewport } = usePlayground()

  return (
    <div className="w-full h-full flex flex-col border-l border-base-150">
      <header className="relative w-full h-10 bg-base-0 px-5 flex items-center border-b border-base-150">
        <div className="flex">
          {
            [LucideArrowLeft, LucideArrowRight, LucideRefreshCw].map((Icon, i) => (
              <button
                key={i} 
                onClick={reloadViewport}
                className={cn('p-1 rounded-md bg-transparent transition-colors hover:bg-base-100', { 'ml-3': i === 2 })}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))
          }
        </div>
      </header>

      <div className="relative bg-base-100 flex flex-col flex-grow">
        {/* {
          loading && <LoadingOverlay />
        } */}
        {viewport}
      </div>
    </div>
  )
}
