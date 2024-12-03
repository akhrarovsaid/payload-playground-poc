import { useState, useEffect } from "react"

import { usePlayground } from "@/providers/Playground"
import { PlaygroundEditor } from "./PlaygroundEditor"
import { PlaygroundViewport } from "./PlaygroundViewport"
import { mockFilesBlankTemplate } from "@/providers/Playground/mockFiles"
import { PlaygroundToolbar } from "./PlaygroundToolbar"

export const Playground = () => {
  const {
    webContainer,
    terminal,
    mountFiles,
    installDependencies,
    restartDevServer,
  } = usePlayground()

  const [loading, setLoading] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await mountFiles(mockFilesBlankTemplate)
      await installDependencies()
      await restartDevServer()
      console.log('here in init: ', webContainer, terminal)
      
      setHasInitialized(true)
      setLoading(false)
    }

    if (!hasInitialized && webContainer && terminal) {
      init()
    }
  }, [
    hasInitialized, 
    webContainer,
    terminal,
    installDependencies, 
    mountFiles, 
    restartDevServer
  ])
  
  return (
    <main className='grid grid-cols-[3fr_8.1fr_8.1fr] grid-flow-col flex-grow'>
      <PlaygroundToolbar />
      <PlaygroundEditor />
      <PlaygroundViewport loading={loading} />
    </main>
  )
}
