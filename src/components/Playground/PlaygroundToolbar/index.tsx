import { NavGroup } from "@/components/NavGroup"

export const PlaygroundToolbar = () => {

  return (
    <aside className='w-[18.75rem] h-full pl-5'>
        
      <div className='h-full border-x border-base-150 w-full px-5 pt-5 space-y-3'>
        
        <NavGroup label='Environment'>
          Hello world
        </NavGroup>

        <NavGroup label='File Explorer'>
          Hello world
        </NavGroup>

      </div>

    </aside>
  )
}
