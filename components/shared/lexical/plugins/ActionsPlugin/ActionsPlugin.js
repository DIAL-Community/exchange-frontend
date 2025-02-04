/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { $createTextNode, $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND } from 'lexical'
import { $createCodeNode, $isCodeNode } from '@lexical/code'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import useModal from '../../hooks/useModal'
import Button from '../../ui/Button'
import { PLAYGROUND_TRANSFORMERS } from '../MarkdownTransformers/MarkdownTransformers'
import { SPEECH_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION } from '../SpeechToTextPlugin/SpeechToTextPlugin'
import { exportFile, importFile } from './LexicalFile'
import { $convertFromMarkdownString, $convertToMarkdownString } from './LexicalMarkdown'

export default function ActionsPlugin({ shouldPreserveNewLinesInMarkdown }) {
  const [editor] = useLexicalComposerContext()
  const [isSpeechToText, setIsSpeechToText] = useState(false)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)
  const [modal, showModal] = useModal()

  useEffect(() => {
    return editor.registerUpdateListener(
      () => {
        editor.getEditorState().read(() => {
          const root = $getRoot()
          const children = root.getChildren()

          if (children.length > 1) {
            setIsEditorEmpty(false)
          } else {
            if ($isParagraphNode(children[0])) {
              const paragraphChildren = children[0].getChildren()
              setIsEditorEmpty(paragraphChildren.length === 0)
            } else {
              setIsEditorEmpty(false)
            }
          }
        })
      }
    )
  }, [editor])

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot()
      const firstChild = root.getFirstChild()
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          PLAYGROUND_TRANSFORMERS, // node
          undefined,
          shouldPreserveNewLinesInMarkdown
        )
      } else {
        const markdown = $convertToMarkdownString(
          PLAYGROUND_TRANSFORMERS, //node
          undefined,
          shouldPreserveNewLinesInMarkdown
        )
        const codeNode = $createCodeNode('markdown')
        codeNode.append($createTextNode(markdown))
        root.clear().append(codeNode)
        if (markdown.length === 0) {
          codeNode.select()
        }
      }
    })
  }, [editor, shouldPreserveNewLinesInMarkdown])

  const actionButtons = (
    <div className='actions'>
      {SUPPORT_SPEECH_RECOGNITION && (
        <button
          type='button'
          disabled={!editor.isEditable()}
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText)
            setIsSpeechToText(!isSpeechToText)
          }}
          className={classNames(
            'action-button action-button-mic',
            (isSpeechToText ? 'active' : '')
          )}
          title='Speech To Text'
          aria-label={`${isSpeechToText ? 'Enable' : 'Disable'} speech to text`}
        >
          <i className='mic' />
        </button>
      )}
      <button
        type='button'
        className='action-button import'
        onClick={() => importFile(editor)}
        title='Import'
        aria-label='Import editor state from JSON'
      >
        <i className='import' />
      </button>

      <button
        type='button'
        className='action-button export'
        onClick={() =>
          exportFile(editor, {
            fileName: `Playground ${new Date().toISOString()}`,
            source: 'Playground'
          })
        }
        title='Export'
        aria-label='Export editor state to JSON'
      >
        <i className='export' />
      </button>
      <button
        type='button'
        className='action-button clear'
        disabled={isEditorEmpty || !editor.isEditable()}
        onClick={() => {
          showModal('Clear editor', onClose => (
            <ShowClearDialog editor={editor} onClose={onClose} />
          ))
        }}
        title='Clear'
        aria-label='Clear editor contents'
      >
        <i className='clear' />
      </button>
      <button
        type='button'
        disabled={!editor.isEditable()}
        className='action-button'
        onClick={handleMarkdownToggle}
        title='Convert From Markdown'
        aria-label='Convert from markdown'
      >
        <i className='markdown' />
      </button>
      {modal}
    </div>
  )

  return editor.isEditable() ? actionButtons : null
}

function ShowClearDialog({ editor, onClose }) {
  return (
    <>
      Are you sure you want to clear the editor?
      <div className='Modal__content'>
        <Button
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
            editor.focus()
            onClose()
          }}
        >
          Clear
        </Button>{' '}
        <Button
          onClick={() => {
            editor.focus()
            onClose()
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  )
}
