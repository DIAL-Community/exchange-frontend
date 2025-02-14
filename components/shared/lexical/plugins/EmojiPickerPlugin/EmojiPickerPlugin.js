/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin'

class EmojiOption extends MenuOption {
  constructor(title, emoji, options) {
    super(title)
    this.title = title
    this.emoji = emoji
    this.keywords = options.keywords || []
  }
}
function EmojiMenuItem({ index, isSelected, onClick, onMouseEnter, option }) {
  let className = 'item'
  if (isSelected) {
    className += ' selected'
  }

  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role='option'
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className='text'>
        {option.emoji} {option.title}
      </span>
    </li>
  )
}

const MAX_EMOJI_SUGGESTION_COUNT = 10

export default function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState(null)
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
    import('../../utils/emoji-list').then(file => setEmojis(file.default))
  }, [])

  const emojiOptions = useMemo(
    () =>
      emojis != null
        ? emojis.map(
          ({ emoji, aliases, tags }) =>
            new EmojiOption(aliases[0], emoji, {
              keywords: [...aliases, ...tags]
            })
        )
        : [],
    [emojis]
  )

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {
    minLength: 0
  })

  const options = useMemo(() => {
    return emojiOptions
      .filter(option => {
        return queryString != null
          ? new RegExp(queryString, 'gi').exec(option.title) ||
            option.keywords != null
            ? option.keywords.some(keyword =>
              new RegExp(queryString, 'gi').exec(keyword)
            )
            : false
          : emojiOptions
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT)
  }, [emojiOptions, queryString])

  const onSelectOption = useCallback(
    (selectedOption, nodeToRemove, closeMenu) => {
      editor.update(() => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection) || selectedOption == null) {
          return
        }

        if (nodeToRemove) {
          nodeToRemove.remove()
        }

        selection.insertNodes([$createTextNode(selectedOption.emoji)])

        closeMenu()
      })
    },
    [editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null
        }

        return anchorElementRef.current && options.length
          ? createPortal(
            <div className='typeahead-popover emoji-menu'>
              <ul>
                {options.map((option, index) => (
                  <EmojiMenuItem
                    key={option.key}
                    index={index}
                    isSelected={selectedIndex === index}
                    onClick={() => {
                      setHighlightedIndex(index)
                      selectOptionAndCleanUp(option)
                    }}
                    onMouseEnter={() => {
                      setHighlightedIndex(index)
                    }}
                    option={option}
                  />
                ))}
              </ul>
            </div>,
            anchorElementRef.current
          )
          : null
      }}
    />
  )
}
