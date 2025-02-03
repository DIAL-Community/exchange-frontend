import './DraggableBlockPlugin.module.css'
import { useRef } from 'react'
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin'

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu'

function isOnMenu(element) {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`)
}

export default function DraggableBlockPlugin({ anchorElem = document.body }) {
  const menuRef = useRef(null)
  const targetLineRef = useRef(null)

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div ref={menuRef} className='icon draggable-block-menu'>
          <div className='icon' />
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className='draggable-block-target-line' />
      }
      isOnMenu={isOnMenu}
    />
  )
}
