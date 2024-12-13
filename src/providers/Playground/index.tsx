import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FileSystemTree, reloadPreview, WebContainer } from '@webcontainer/api'
import { Terminal } from '@xterm/xterm'

import { PlaygroundContextType } from './types'

const initialContext: PlaygroundContextType = {
  webContainer: undefined,
  terminal: undefined,
  mountFiles: async () => undefined,
  installDependencies: async () => undefined,
  restartDevServer: async () => undefined,
  reloadViewport: async () => undefined,
}

export const PlaygroundContext = createContext(initialContext)


// TODO: Return exit codes for error handling
export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
  const [webContainer, setPlayground] = useState<WebContainer>()
  const [viewportSrc, setViewportSrc] = useState<string>()

  const bootedContainer = useRef<boolean>(false)
  const terminalRef = useRef<Terminal | undefined>(undefined)
  const viewportRef = useRef<HTMLIFrameElement>(null)

  const mountFiles = useCallback(async (files: FileSystemTree) => {
    if (!webContainer) {
      return
    }
    console.log('MOUNTING FILES')
    await webContainer.mount(files)
  }, [webContainer])

  const installDependencies = useCallback(async () => {
    if (!webContainer || !terminalRef.current) {
      return
    }
    console.log('INSTALLING DEPS')
    const process = await webContainer.spawn('pnpm', ['install'])

    process.output.pipeTo(new WritableStream({
      write(data) {
        terminalRef.current?.write(data)
        console.log(data)
      }
    }))
    
    return process.exit
  }, [webContainer])

  const restartDevServer = useCallback(async () => {
    if (!webContainer || !terminalRef.current) {
      return
    }
    console.log('STARTING DEV SERVER')
    const process = await webContainer.spawn('pnpm', ['dev'])

    process.output.pipeTo(new WritableStream({
      write(data) {
        const terminal = terminalRef.current
        if (terminal) {
          terminal.write(data)
        } else {
          console.log(data)
        }
        
      }
    }))
  }, [webContainer])

  const reloadViewport = useCallback(async () => {
    if (!viewportRef.current) {
      return
    }
    await reloadPreview(viewportRef.current)
  }, [])

  const viewport = useMemo(() => (
    <iframe
      ref={viewportRef}
      src={viewportSrc}
      className='w-full h-full border-none flex flex-col'
    />
  ), [viewportSrc])

  useEffect(() => {
    const initPlayground = async () => {
      const container = await WebContainer.boot()

      container.on('server-ready', (port, url) => setViewportSrc(`${url}/admin`))

      container.on('error', (error) => console.log(error))

      terminalRef.current = new Terminal({ convertEol: true })
      setPlayground(container)
    }

    if (!bootedContainer.current) {
      bootedContainer.current = true
      console.log('BOOTING CONTAINER')
      initPlayground()
    }
  }, [])

  return (
    <PlaygroundContext.Provider 
      value={{ 
        terminal: terminalRef.current,
        webContainer,
        viewport,
        mountFiles,
        installDependencies,
        restartDevServer,
        reloadViewport
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}

export const usePlayground = (): PlaygroundContextType => {
  const context = useContext(PlaygroundContext)

  if (typeof context === 'undefined') {
    throw new Error('usePlayground can only be used in a PlaygroundContext provider')
  }

  return context
}
