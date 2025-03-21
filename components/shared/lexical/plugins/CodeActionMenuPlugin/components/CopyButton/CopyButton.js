/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react'
import { $getNearestNodeFromDOMNode, $getSelection, $setSelection } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import { useDebounce } from '../../CodeActionMenuUtils'

export function CopyButton({ editor, getCodeDOMNode }) {
  const [isCopyCompleted, setCopyCompleted] = useState(false)

  const removeSuccessIcon = useDebounce(() => {
    setCopyCompleted(false)
  }, 1000)

  async function handleClick() {
    const codeDOMNode = getCodeDOMNode()

    if (!codeDOMNode) {
      return
    }

    let content = ''

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode)

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent()
      }

      const selection = $getSelection()
      $setSelection(selection)
    })

    try {
      await navigator.clipboard.writeText(content)
      setCopyCompleted(true)
      removeSuccessIcon()
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <button
      type='button'
      className='menu-item'
      onClick={handleClick}
      aria-label='copy'
    >
      {isCopyCompleted
        ? <i className='format success' />
        : <i className='format copy' />
      }
    </button>
  )
}
