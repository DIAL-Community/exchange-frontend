/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  $createParagraphNode, $createRangeSelection, $getNodeByKey, $getSelection, $insertNodes, $isNodeSelection,
  $isRootOrShadowRoot, $setSelection, COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW, createCommand,
  DRAGOVER_COMMAND, DRAGSTART_COMMAND, DROP_COMMAND, getDOMSelectionFromTarget, isHTMLElement
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { useUser } from '../../../../../lib/hooks'
import { isDebugLoggingEnabled } from '../../../../utils/utilities'
import { $createImageNode, $isImageNode, ImageNode } from '../../nodes/ImageNode'
import Button from '../../ui/Button'
import { DialogActions, DialogButtonsList } from '../../ui/Dialog'
import FileInput from '../../ui/FileInput'
import TextInput from '../../ui/TextInput'

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND')

export function InsertImageUriDialogBody({ onClick }) {
  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')

  const isDisabled = src === ''

  return (
    <>
      <TextInput
        label='Image URL'
        placeholder='i.e. https://source.unsplash.com/random'
        onChange={setSrc}
        value={src}
        data-test-id='image-modal-url-input'
      />
      <TextInput
        label='Alt Text'
        placeholder='Random unsplash image'
        onChange={setAltText}
        value={altText}
        data-test-id='image-modal-alt-text-input'
      />
      <DialogActions>
        <Button
          data-test-id='image-modal-confirm-btn'
          disabled={isDisabled}
          onClick={() => onClick({ altText, src })}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  )
}

export function InsertImageUploadedDialogBody({ onClick }) {
  const { user } = useUser()

  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')

  const isDisabled = src === ''

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

  return (
    <>
      <FileInput
        label='Image Upload'
        onChange={loadImage}
        accept='image/*'
        data-test-id='image-modal-file-upload'
      />
      <TextInput
        label='Alt Text'
        placeholder='Descriptive alternative text'
        onChange={setAltText}
        value={altText}
        data-test-id='image-modal-alt-text-input'
      />
      <DialogActions>
        <Button
          data-test-id='image-modal-file-upload-btn'
          disabled={isDisabled}
          onClick={() => onClick({ altText, src })}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  )
}

export function InsertImageDialog({ activeEditor, onClose }) {
  const [mode, setMode] = useState(null)
  const hasModifier = useRef(false)

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

  const onClick = payload => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
    onClose()
  }

  return (
    <>
      {!mode && (
        <DialogButtonsList>
          <Button
            data-test-id='image-modal-option-sample'
            onClick={() =>
              onClick(
                hasModifier.current
                  ? {
                    altText: 'Daylight fir trees forest glacier green high ice landscape',
                    src: '/lexical/landscape.jpg'
                  }
                  : {
                    altText: 'Yellow flower in tilt shift lens',
                    src: '/lexical/yellow-flower.jpg'
                  }
              )
            }
          >
            Sample
          </Button>
          <Button
            data-test-id='image-modal-option-url'
            onClick={() => setMode('url')}
          >
            URL
          </Button>
          <Button
            data-test-id='image-modal-option-file'
            onClick={() => setMode('file')}
          >
            File
          </Button>
        </DialogButtonsList>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  )
}

export default function ImagesPlugin({ captionsEnabled }) {
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
          maxWidth: node.__maxWidth,
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
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, data)
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

    return $isImageNode(node) ? node : null
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
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        payload => {
          const imageNode = $createImageNode(payload)
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
  }, [captionsEnabled, editor, $onDragStart, $onDragover, $onDrop])

  useEffect(() => {
    editor.registerMutationListener(
      ImageNode,
      (mutatedNodes, payload) => {
        const { prevEditorState } = payload
        for (let [nodeKey, mutation] of mutatedNodes) {
          if (mutation === 'destroyed') {
            prevEditorState.read(() => {
              const imageNode = $getNodeByKey(nodeKey)
              if (imageNode && isDebugLoggingEnabled()) {
                console.log('Image node removed: ', imageNode)
              }
            })
          }
        }
      },
      { skipInitialization: false }
    )
  }, [editor])

  return null
}
