import { Root, Item, Header, Trigger, Content } from "@radix-ui/react-accordion"
import { ChevronRightIcon } from "lucide-react"
import { ReactNode } from "react"

type Props = {
  label: string
  children: ReactNode
}

export const NavGroup = ({
  label,
  children
}: Props) => {

  return (
    <Root type='single' collapsible>
      <Item value={label}>
        <Header>
          <Trigger className='group flex items-center gap-2 text-base-450 hover:text-base-1000 transition-colors'>
            <span>{label}</span>
            <ChevronRightIcon className='w-4 h-4 transition-all opacity-0 group-data-[state="open"]:rotate-90 group-data-[state="open"]:opacity-100 group-hover:opacity-100' />
          </Trigger>
        </Header>
        <Content className="pl-3">
          {children}
        </Content>
      </Item>
    </Root>
  )
}
