import React from 'react'

import { PlaygroundBlockClient } from './Component.client'

export type PlaygroundBlockProps = {
  blockType: 'playground'
}

type Props = PlaygroundBlockProps & {
  className?: string
}

export const PlaygroundBlock: React.FC<Props> = ({ className }) => {
  return (
    <article className={[className, 'flex flex-col flex-grow w-full h-full'].filter(Boolean).join(' ')}>
      <PlaygroundBlockClient />
    </article>
  )
}
