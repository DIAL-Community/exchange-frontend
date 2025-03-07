/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  $createParagraphNode, $createRangeSelection, $getSelection, $insertNodes, $isNodeSelection, $isRootOrShadowRoot,
  $setSelection, COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW, createCommand, DRAGOVER_COMMAND,
  DRAGSTART_COMMAND, DROP_COMMAND, getDOMSelectionFromTarget, isHTMLElement
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { useUser } from '../../../../../lib/hooks'
import { $createInlineImageNode, $isInlineImageNode, InlineImageNode } from '../../nodes/InlineImageNode/InlineImageNode'
import Button from '../../ui/Button'
import { DialogActions } from '../../ui/Dialog'
import FileInput from '../../ui/FileInput'
import Select from '../../ui/Select'
import TextInput from '../../ui/TextInput'

export const INSERT_INLINE_IMAGE_COMMAND = createCommand(
  'INSERT_INLINE_IMAGE_COMMAND'
)

export function InsertInlineImageDialog({ activeEditor, onClose }) {
  const { user } = useUser()
  const hasModifier = useRef(false)

  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')
  const [showCaption, setShowCaption] = useState(false)
  const [position, setPosition] = useState('left')

  const isDisabled = src === ''

  const handleShowCaptionChange = e => {
    setShowCaption(e.target.checked)
  }

  const handlePositionChange = e => {
    setPosition(e.target.value)
  }

  const loadImage = (files) => {
    const [file] = files

    const formData = new FormData()
    formData.append('file', file)

    const uploadPath = `${process.env.NEXT_PUBLIC_AUTH_SERVER}/entities/process-image`
    fetch(uploadPath, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie',
        'X-User-Email': user.userEmail,
        'X-User-Token': user.userToken
      },
      body: formData
    }).then(
      response => response.json()
    ).then(
      data => setSrc(process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data.src)
    ).catch(
      error => console.log('Unable to process image. ', error)
    )
  }

  useEffect(() => {
    hasModifier.current = false
    const handler = e => {
      hasModifier.current = e.altKey
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [activeEditor])

  const handleOnClick = () => {
    const payload = { altText, position, showCaption, src }
    activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload)
    onClose()
  }

  return (
    <>
      <div style={{ marginBottom: '1em' }}>
        <FileInput
          label='Image Upload'
          onChange={loadImage}
          accept='image/*'
          data-test-id='image-modal-file-upload'
        />
      </div>
      <div style={{ marginBottom: '1em' }}>
        <TextInput
          label='Alt Text'
          placeholder='Descriptive alternative text'
          onChange={setAltText}
          value={altText}
          data-test-id='image-modal-alt-text-input'
        />
      </div>

      <Select
        style={{ marginBottom: '1em', width: '290px' }}
        label='Position'
        name='position'
        id='position-select'
        onChange={handlePositionChange}
      >
        <option value='left'>Left</option>
        <option value='right'>Right</option>
        <option value='full'>Full Width</option>
      </Select>

      <div className='Input__wrapper'>
        <input
          id='caption'
          className='InlineImageNode_Checkbox'
          type='checkbox'
          checked={showCaption}
          onChange={handleShowCaptionChange}
        />
        <label htmlFor='caption'>Show Caption</label>
      </div>

      <DialogActions>
        <Button
          data-test-id='image-modal-file-upload-btn'
          disabled={isDisabled}
          onClick={() => handleOnClick()}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  )
}

export default function InlineImagePlugin() {
  const [editor] = useLexicalComposerContext()

  const TRANSPARENT_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  const img = document.createElement('img')
  img.src = TRANSPARENT_IMAGE

  const $onDragStart = useCallback((event) => {
    const node = $getImageNodeInSelection()
    if (!node) {
      return false
    }

    const dataTransfer = event.dataTransfer
    if (!dataTransfer) {
      return false
    }

    dataTransfer.setData('text/plain', '_')
    dataTransfer.setDragImage(img, 0, 0)
    dataTransfer.setData(
      'application/x-lexical-drag',
      JSON.stringify({
        data: {
          altText: node.__altText,
          caption: node.__caption,
          height: node.__height,
          key: node.getKey(),
          showCaption: node.__showCaption,
          src: node.__src,
          width: node.__width
        },
        type: 'image'
      })
    )

    return true
  }, [img])

  const $onDragover = useCallback((event) => {
    const node = $getImageNodeInSelection()
    if (!node) {
      return false
    }

    if (!canDropImage(event)) {
      event.preventDefault()
    }

    return true
  }, [])

  const $onDrop = useCallback((event, editor) => {
    const node = $getImageNodeInSelection()
    if (!node) {
      return false
    }

    const data = getDragImageData(event)
    if (!data) {
      return false
    }

    event.preventDefault()
    if (canDropImage(event)) {
      const range = getDragSelection(event)
      node.remove()
      const rangeSelection = $createRangeSelection()
      if (range !== null && range !== undefined) {
        rangeSelection.applyDOMRange(range)
      }

      $setSelection(rangeSelection)
      editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, data)
    }

    return true
  }, [])

  function $getImageNodeInSelection() {
    const selection = $getSelection()
    if (!$isNodeSelection(selection)) {
      return null
    }

    const nodes = selection.getNodes()
    const node = nodes[0]

    return $isInlineImageNode(node) ? node : null
  }

  function getDragImageData(event) {
    const dragData = event.dataTransfer?.getData('application/x-lexical-drag')
    if (!dragData) {
      return null
    }

    const { type, data } = JSON.parse(dragData)
    if (type !== 'image') {
      return null
    }

    return data
  }

  function canDropImage(event) {
    const target = event.target

    return !!(
      isHTMLElement(target) &&
      !target.closest('code, span.editor-image') &&
      isHTMLElement(target.parentElement) &&
      target.parentElement.closest('div.ContentEditable__root')
    )
  }

  function getDragSelection(event) {
    let range
    const domSelection = getDOMSelectionFromTarget(event.target)
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(event.clientX, event.clientY)
    } else if (event.rangeParent && domSelection !== null) {
      domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
      range = domSelection.getRangeAt(0)
    } else {
      throw Error('Cannot get the selection when dragging')
    }

    return range
  }

  useEffect(() => {
    if (!editor.hasNodes([InlineImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_INLINE_IMAGE_COMMAND,
        payload => {
          const imageNode = $createInlineImageNode(payload)
          $insertNodes([imageNode])
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        event => {
          return $onDragStart(event)
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        DRAGOVER_COMMAND,
        event => {
          return $onDragover(event)
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DROP_COMMAND,
        event => {
          return $onDrop(event, editor)
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, $onDragStart, $onDragover, $onDrop])

  return null
}
