/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  $getNodeByKey, $getSelection, $isNodeSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND
} from 'lexical'
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import Button from '../ui/Button'
import joinClasses from '../utils/joinClasses'
import { $isPollNode, createPollOption } from './PollNode'

function getTotalVotes(options) {
  return options.reduce((totalVotes, next) => {
    return totalVotes + next.votes.length
  }, 0)
}

function PollOptionComponent({
  index,
  option,
  options,
  totalVotes,
  withPollNode,
  editable
}) {
  const { clientID } = useCollaborationContext()
  const checkboxRef = useRef(null)
  const votesArray = option.votes
  const checkedIndex = votesArray.indexOf(clientID)
  const checked = checkedIndex !== -1
  const votes = votesArray.length
  const text = option.text

  return (
    <div className='PollNode__optionContainer'>
      <div
        className={joinClasses(
          'PollNode__optionCheckboxWrapper',
          checked && 'PollNode__optionCheckboxChecked'
        )}
      >
        <input
          ref={checkboxRef}
          className='PollNode__optionCheckbox'
          type='checkbox'
          onChange={() => {
            withPollNode(node => {
              node.toggleVote(option, clientID)
            })
          }}
          checked={checked}
        />
      </div>
      <div className='PollNode__optionInputWrapper'>
        <div
          className='PollNode__optionInputVotes'
          style={{ width: `${votes === 0 ? 0 : (votes / totalVotes) * 100}%` }}
        />
        <span className='PollNode__optionInputVotesCount'>
          {votes > 0 && (votes === 1 ? '1 vote' : `${votes} votes`)}
        </span>
        <input
          className='PollNode__optionInput'
          type='text'
          value={text}
          disabled={!editable}
          onChange={e => {
            if (editable) {
              const target = e.target
              const value = target.value
              const selectionStart = target.selectionStart
              const selectionEnd = target.selectionEnd
              withPollNode(
                node => {
                  node.setOptionText(option, value)
                },
                () => {
                  target.selectionStart = selectionStart
                  target.selectionEnd = selectionEnd
                }
              )
            }
          }}
          placeholder={`Option ${index + 1}`}
        />
      </div>
      {editable &&
        <button
          type='button'
          disabled={options.length < 3}
          className={joinClasses(
            'PollNode__optionDelete',
            options.length < 3 && 'PollNode__optionDeleteDisabled'
          )}
          aria-label='Remove'
          onClick={() => {
            withPollNode(node => {
              node.deleteOption(option)
            })
          }}
        />
      }
    </div>
  )
}

export default function PollComponent({ question, options, nodeKey }) {
  const [editor] = useLexicalComposerContext()
  const totalVotes = useMemo(() => getTotalVotes(options), [options])
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(
    nodeKey
  )
  const [selection, setSelection] = useState(null)
  const ref = useRef(null)

  const $onDelete = useCallback(
    payload => {
      const deleteSelection = $getSelection()
      if (isSelected && $isNodeSelection(deleteSelection)) {
        const event = payload
        event.preventDefault()
        deleteSelection.getNodes().forEach(node => {
          if ($isPollNode(node)) {
            node.remove()
          }
        })
      }

      return false
    },
    [isSelected]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()))
      }),
      editor.registerCommand(
        CLICK_COMMAND,
        payload => {
          const event = payload

          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection()
            }

            setSelected(!isSelected)

            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected])

  const withPollNode = (cb, onUpdate) => {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey)
        if ($isPollNode(node)) {
          cb(node)
        }
      },
      { onUpdate }
    )
  }

  const addOption = () => {
    withPollNode(node => {
      node.addOption(createPollOption())
    })
  }

  const isFocused = $isNodeSelection(selection) && isSelected

  return (
    <div
      className={`PollNode__container ${isFocused ? 'focused' : ''}`}
      ref={ref}
    >
      <div className='PollNode__inner'>
        <h2 className='PollNode__heading'>{question}</h2>
        {options.map((option, index) => {
          const key = option.uid

          return (
            <PollOptionComponent
              key={key}
              index={index}
              option={option}
              options={options}
              totalVotes={totalVotes}
              withPollNode={withPollNode}
              editable={editor.isEditable()}
            />
          )
        })}
        {editor.isEditable() &&
          <div className='PollNode__footer'>
            <Button onClick={addOption} small={true}>
              Add Option
            </Button>
          </div>
        }
      </div>
    </div>
  )
}
