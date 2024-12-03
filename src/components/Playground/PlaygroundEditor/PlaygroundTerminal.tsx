'use client'

import { LucideTerminal } from "lucide-react"
import { FC, useEffect, useRef, useState } from "react"
import { FitAddon } from '@xterm/addon-fit'

import { usePlayground } from "@/providers/Playground"
import { cn } from "@/utilities/cn"

import '@xterm/xterm/css/xterm.css'

type Props = {
  onOpen: () => void
  isOpen: boolean
}

export const PlaygroundTerminal: FC<Props> = ({ onOpen, isOpen }) => {
  const { terminal } = usePlayground()

  const terminalElRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<boolean>(false)

  useEffect(() => {
    if (terminal && terminalElRef.current && !mountRef.current) {
      /* const fitAddon = new FitAddon() */
      /* terminal.loadAddon(fitAddon) */
      terminal.open(terminalElRef.current)
      /* fitAddon.fit() */
      mountRef.current = true
    }
  }, [terminal])

  return (
    <div
      className={cn('w-full flex flex-col h-7 sticky bottom-0 mt-auto bg-base-1000', { 'h-80 relative flex-shrink-0': isOpen })}
    >
      <header className="bg-base-1000 h-7 border-t border-base-750">
        <button
          className='py-1 px-3 rounded-md text-base-200 bg-transparent transition-colors hover:bg-base-0 hover:text-base-900 flex text-sm items-center gap-1'
          onClick={onOpen}
        >
          <LucideTerminal className="w-4 h-4" /> Terminal
        </button>
      </header>
      <div ref={terminalElRef} className="max-h-72 pl-3" />
    </div>
  )
}
