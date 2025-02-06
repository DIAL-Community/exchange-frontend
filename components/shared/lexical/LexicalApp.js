/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import classNames from 'classnames'
import { $isTextNode, TextNode } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { FlashMessageContext } from './context/FlashMessageContext'
import { SettingsContext } from './context/SettingsContext'
import { SharedHistoryContext } from './context/SharedHistoryContext'
import { ToolbarContext } from './context/ToolbarContext'
import LexicalEditor from './LexicalEditor'
import PlaygroundNodes from './nodes/PlaygroundNodes'
import { TableContext } from './plugins/TablePlugin'
import { parseAllowedFontSize } from './plugins/ToolbarPlugin/FontSize'
import ExchangeLexicalTheme from './themes/ExchangeLexicalTheme'
import { parseAllowedColor } from './ui/ColorPicker'

function getExtraStyles(element) {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = ''
  const fontSize = parseAllowedFontSize(element.style.fontSize)
  const backgroundColor = parseAllowedColor(element.style.backgroundColor)
  const color = parseAllowedColor(element.style.color)
  if (fontSize !== '' && fontSize !== '15px') {
    extraStyles += `font-size: ${fontSize};`
  }

  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`
  }

  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`
  }

  return extraStyles
}

function buildImportMap() {
  const importMap = {}

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = importNode => {
      const importer = fn(importNode)
      if (!importer) {
        return null
      }

      return {
        ...importer,
        conversion: element => {
          const output = importer.conversion(element)
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output
          }

          const extraStyles = getExtraStyles(element)
          if (extraStyles) {
            const { forChild } = output

            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent)
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles)
                }

                return textNode
              }
            }
          }

          return output
        }
      }
    }
  }

  return importMap
}

function LexicalInternal({ editable, initialHtml, onHtmlChanged }) {
  const initialConfig = {
    editable,
    html: { import: buildImportMap() },
    namespace: 'Exchange Lexical Playground',
    nodes: [...PlaygroundNodes],
    onError: error => {
      throw error
    },
    theme: ExchangeLexicalTheme
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <ToolbarContext>
            <div
              className={classNames(
                'editor-shell',
                editable ? 'read-write' : 'read-only'
              )}
            >
              <LexicalEditor
                initialHtml={initialHtml}
                onHtmlChanged={onHtmlChanged}
              />
            </div>
          </ToolbarContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  )
}

export default function LexicalApp({ editable, initialHtml, onHtmlChanged }) {
  return (
    <SettingsContext>
      <FlashMessageContext>
        <LexicalInternal
          editable={editable}
          initialHtml={initialHtml}
          onHtmlChanged={onHtmlChanged}
        />
      </FlashMessageContext>
    </SettingsContext>
  )
}
