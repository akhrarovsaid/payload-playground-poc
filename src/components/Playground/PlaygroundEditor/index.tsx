'use client'

import CodeMirror from '@uiw/react-codemirror'

import { defaultCode } from "./defaults"
import { extensions } from "./extensions"
import { theme } from "./theme"
import { PlaygroundEditorTabs } from './PlaygroundEditorTabs'
import { PlaygroundTerminal } from './PlaygroundTerminal'
import { useState } from 'react'
import { cn } from '@/utilities/cn'

export const PlaygroundEditor = () => {
  const [terminalOpen, setTerminalOpen] = useState(true)

  return (
    <div className='w-full h-full bg-base-900 overflow-hidden relative flex flex-col'>
      <div className={cn('absolute inset-0 bottom-7 overflow-y-auto flex flex-col', { 'bottom-80': terminalOpen })}>
        <PlaygroundEditorTabs />
        <CodeMirror 
          className='w-full flex-grow'
          extensions={extensions}
          theme={theme}
          value={defaultCode}
        />
      </div>
      <PlaygroundTerminal 
        isOpen={terminalOpen} 
        onOpen={() => setTerminalOpen(!terminalOpen)} 
      />
    </div>
  )
}
